import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../Model/userModel.js';

// Only configure GoogleStrategy if env vars are present
if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL
) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;
                    const username = profile.displayName;

                    let existingUser = await User.findOne({ email });
                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    // Return temp object for OTP flow + profile completion
                    return done(null, { temp: true, email, username });
                } catch (err) {
                    done(err, false);
                }
            }
        )
    );
} else {
    console.warn(
        'Google OAuth not configured: missing GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL'
    );
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

export default passport;
