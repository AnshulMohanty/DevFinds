const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // 2 users can't have the same email
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      select: false,    // security feature: jab hum user ko search karenge, toh password by default return nahi hoga
    },
    // baad me use hoga for OAuth logins (e.g., Google, GitHub), taaki hum ye track kar sakein ki user ne kaunse method se register kiya hai
    oauth_provider: {
      type: String,
      enum: ['google', 'github', 'local'],
      default: 'local',
    },
    oauth_id: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);


// --- Mongoose Middleware (Hooks) ---

// 1. pw encrypt krne ke liye bcrypt ka use karte hain. Ye middleware har baar tab trigger hoga jab user document save hoga (e.g., during registration or password update).
userSchema.pre('save', async function (next) {
  // agar pw modify nhi kr rha hai ya hua toh nahi hai, toh hum next() call kar denge
  if (!this.isModified('password')) {
    next();
  }

  // Generate a 'salt' (random data added to the password before hashing)
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Custom Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//index to make emails lookup fast
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;