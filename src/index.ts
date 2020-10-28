import express, {Request, Response, NextFunction } from 'express';
import constants from './config/constants';
import justify from './justifier';
import { requireJwtMiddleware } from './jwt/requireJwtMiddleware';
import { encodeSession } from './jwt/encodeSession';
import { Session } from './common/types';
import Auth from './auth/auth';
import database from './db/db';

const app = express();
app.listen(constants.port, () => console.log(`Server is listening on port ${constants.port}`));
app.use(express.json({limit: '1mb'}));
app.use(express.text({limit: '1mb'}));

app.use("/api/justify", requireJwtMiddleware);

const awaitHandlerFactory = (middleware: any) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            await middleware(request, response, next);
        } catch (err) {
            next(err);
        }
    };
};

app.post('/api/justify', awaitHandlerFactory( async (request: Request, response: Response) => {
    console.log('I got a request!', '/api/justify');
    const data = request.body;

    const session: Session = response.locals.session;
    console.log('session', session);
    
    let user;
    await database.findOne({ email: session.email }, (error, document) => {
        if (error) {
            return response.status(400).json({ error: error });
            return;
        } else {
            let user = document;
            if (!user) {
                return response.status(200).json({ error: "User does not exist" });
            }
            justify(data, user.wordsQuota, callback)
            console.log('User', user);
        }
    });
    let callback = (errorCode: number | null, error: string | null, text: string | null, newQuota: number | null) => {
        console.log(errorCode, error, text, newQuota);
        if (!errorCode) {
            database.update({ email: session.email }, { $set: { wordsQuota: newQuota } }, {}, (error, numReplaced) => {
                if (error) {
                    return response.status(400).json({error: error});
                } else {
                    return response.status(200).json({
                            status: 'success',
                            timestamp: Date.now(),
                            text: text,
                            wordsQuota: newQuota
                        });
                }
            });
        } else {
            return response.status(errorCode).json({ error });
        }
    };
}));

app.post('/api/token', (request, response) => {
    console.log('I got a request!', '/api/token');
    const data = request.body;
    const {email, password} = data;

    database.findOne({email: email}, (error, document) => {
        if (error) {
            return response.status(400).json({error: error});
        } else {
            let user = document;
            console.log('User', user);
            if (!user) {
                return response.status(200).json({error: "User does not exist"});
            }

            Auth.compare(password, user.hash, (error: string | null, match: boolean | null) => {
                if (error) {
                    // Passwords do not match
                    return response.status(200).json({error: "User does not exist"});
                } else {
                    const userId = user._id;
                    const email = user.email;
                    const timestamp = Date.now();
                
                    const session = encodeSession(constants.jwtSecretKey, {
                        id: userId,
                        email: email,
                        dateCreated: timestamp
                    })    
                    return response.status(201).json(session);
                }
            })
        }
    })

})

app.post('/api/create-user', (request, response) => {
    console.log('I got a request!', '/api/create-user');
    const data = request.body;
    const {email, password} = data;

    database.findOne({ email: email }, (error, document) => {
        if (error) {
            return response.status(400).json({error: error});
        } else {
            if (!document) {
                Auth.hashPassword(password, 12, (error, hash) => {
                    if (error) {
                        return response.status(400);
                    } else {
                        database.insert({email: email, hash: hash, wordsQuota: 80000}, (error, document) => {
                            if (error) {
                                return response.status(400);
                            } else {
                                return response.status(201).json({email: document.email, wordsQuota: document.wordsQuota});
                            }
                        });
                    }
                });
            } else {
                return response.status(200).json({error: "User with this email already exist"});
            }
        }
    });
})

