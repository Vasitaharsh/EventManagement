import User, { IUser } from '../models/User';

export const createDefaultUser = async () => { 

    const defaultEmail = 'vasitaharsh5@gmail.com';
    const defaultUser = await User.findOne({ email: defaultEmail });

    if (!defaultUser) {
        
        const newUser = new User({
            email: defaultEmail,
            password: 'hello',
            role: 'admin'
        });

        await newUser.save();
        console.log('Default user created:', newUser);
    } else {
        console.log('Default user already exists.');
    }
};
