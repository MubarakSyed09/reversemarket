import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { inMemoryStore, isFallbackActive } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'reversemarket-secret-key-2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, company, location } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Name, User ID/Email, phone, and password are required' });
    }

    if (isFallbackActive()) {
      const existing = inMemoryStore.users.find(u => u.email === email);
      if (existing) return res.status(400).json({ error: 'User already exists' });

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        phone,
        password: bcrypt.hashSync(password, 8),
        role: role || 'buyer',
        company: company || '',
        location: location || 'Vijayawada, India',
        rating: 5.0,
        completedOrders: 0,
        verified: true
      };
      inMemoryStore.users.push(newUser);
      const token = generateToken(newUser);
      return res.status(201).json({ user: newUser, token });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      _id: 'usr_' + Date.now(),
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'buyer',
      company: company || '',
      location: location || 'Vijayawada, India',
      rating: 5.0
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const rawId = (req.body.userId || req.body.email || req.body.username || '').trim();
    const password = req.body.password || '';

    if (!rawId) {
      return res.status(400).json({ error: 'Please enter your User ID' });
    }

    const cleanId = rawId.toLowerCase();

    // Check in-memory store or MongoDB
    let user = null;
    if (isFallbackActive()) {
      user = inMemoryStore.users.find(u => 
        u.email?.toLowerCase() === cleanId || 
        u._id?.toLowerCase() === cleanId ||
        u.name?.toLowerCase() === cleanId ||
        u.name?.toLowerCase().includes(cleanId)
      );
    } else {
      user = await User.findOne({ 
        $or: [
          { email: cleanId }, 
          { _id: cleanId }, 
          { name: new RegExp(cleanId, 'i') }
        ] 
      });
      if (user) user = user.toObject();
    }

    // Auto-create/demo account if not yet seeded
    if (!user) {
      const isSeller = cleanId.includes('seller') || cleanId.includes('supplier');
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: rawId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: cleanId,
        phone: isSeller ? '+91 98111 22334' : '+91 98765 43210',
        password: bcrypt.hashSync(password || 'password123', 8),
        role: isSeller ? 'seller' : 'buyer',
        company: isSeller ? 'Apex MedTech Solutions' : 'Zenith Retail Tech',
        location: isSeller ? 'Bengaluru, India' : 'Mumbai, India',
        rating: 4.9,
        completedOrders: 5,
        verified: true
      };

      if (isFallbackActive()) {
        inMemoryStore.users.push(newUser);
      } else {
        await User.create(newUser);
      }
      user = newUser;
    }

    // Check password
    const isPwMatch = password === 'password123' || 
                      password === 'demo123' || 
                      (user.password && bcrypt.compareSync(password, user.password));

    if (!isPwMatch) {
      return res.status(401).json({ error: 'Invalid password. Try password123' });
    }

    const token = generateToken(user);
    const returnUser = {
      ...user,
      userId: user.email || user._id || cleanId
    };

    return res.json({ user: returnUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, name, role, avatar, phone, company } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google Sign-In' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const displayName = name || cleanEmail.split('@')[0];

    if (isFallbackActive()) {
      let user = inMemoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        user = {
          _id: 'usr_g_' + Date.now(),
          name: displayName,
          email: cleanEmail,
          phone: phone || '+91 98765 43210',
          role: role || 'buyer',
          company: company || `${displayName}'s Enterprise`,
          location: 'Bengaluru, India',
          avatar: avatar || '',
          rating: 4.9,
          completedOrders: 1,
          verified: true
        };
        inMemoryStore.users.push(user);
      }
      const token = generateToken(user);
      return res.json({ user, token });
    }

    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        _id: 'usr_g_' + Date.now(),
        name: displayName,
        email: cleanEmail,
        phone: phone || '+91 98765 43210',
        password: bcrypt.hashSync('google_auth_random_' + Math.random(), 8),
        role: role || 'buyer',
        company: company || `${displayName}'s Enterprise`,
        location: 'Bengaluru, India',
        rating: 4.9,
        verified: true
      });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDemoAccounts = async (req, res) => {
  try {
    let users = [];
    if (isFallbackActive()) {
      users = inMemoryStore.users;
    } else {
      users = await User.find({}).limit(6);
    }

    const sanitized = users.map(u => ({
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      company: u.company,
      location: u.location,
      rating: u.rating
    }));

    res.json({ demoAccounts: sanitized });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
