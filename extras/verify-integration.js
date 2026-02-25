#!/usr/bin/env node
/**
 * Integration Test Script
 * Verifies that frontend and backend are properly configured and can communicate
 */

const fs = require('fs');
const path = require('path');

console.log('\n🌟 Hora Frontend-Backend Integration Verification\n');
console.log('=' .repeat(50));

let allGood = true;

// Check 1: Backend .env file
console.log('\n✓ Checking Backend Configuration...');
const backendEnvPath = path.join(__dirname, 'HoraBackend', 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log('  ✅ Backend .env file exists');
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  
  if (backendEnv.includes('MONGODB_URI')) {
    console.log('  ✅ MONGODB_URI configured');
  } else {
    console.log('  ❌ MONGODB_URI missing - add to .env');
    allGood = false;
  }
  
  if (backendEnv.includes('JWT_SECRET')) {
    console.log('  ✅ JWT_SECRET configured');
  } else {
    console.log('  ❌ JWT_SECRET missing - add to .env');
    allGood = false;
  }
  
  if (backendEnv.includes('CORS_ORIGIN')) {
    console.log('  ✅ CORS_ORIGIN configured');
  } else {
    console.log('  ⚠️  CORS_ORIGIN missing - add to .env (http://localhost:5173)');
  }
} else {
  console.log('  ❌ Backend .env file not found');
  console.log('     Create it using .env.example as a template');
  allGood = false;
}

// Check 2: Frontend .env file
console.log('\n✓ Checking Frontend Configuration...');
const frontendEnvPath = path.join(__dirname, 'HoraBackend', 'frontend', '.env');
if (fs.existsSync(frontendEnvPath)) {
  console.log('  ✅ Frontend .env file exists');
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  
  if (frontendEnv.includes('VITE_API_URL')) {
    console.log('  ✅ VITE_API_URL configured');
  } else {
    console.log('  ❌ VITE_API_URL missing - add to .env (http://localhost:5000)');
    allGood = false;
  }
} else {
  console.log('  ❌ Frontend .env file not found');
  console.log('     Create it using .env.example as a template');
  allGood = false;
}

// Check 3: Backend dependencies
console.log('\n✓ Checking Backend Dependencies...');
const backendPackageJsonPath = path.join(__dirname, 'HoraBackend', 'backend', 'package.json');
if (fs.existsSync(backendPackageJsonPath)) {
  console.log('  ✅ Backend package.json exists');
  const backendPackageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
  
  const requiredDeps = ['express', 'mongoose', 'cors', 'jsonwebtoken', 'dotenv'];
  let missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (backendPackageJson.dependencies[dep]) {
      console.log(`  ✅ ${dep} dependency found`);
    } else {
      console.log(`  ❌ ${dep} dependency missing`);
      missingDeps.push(dep);
      allGood = false;
    }
  });
  
  if (missingDeps.length > 0) {
    console.log(`\n  Run: npm install ${missingDeps.join(' ')}`);
  }
} else {
  console.log('  ❌ Backend package.json not found');
  allGood = false;
}

// Check 4: Frontend dependencies
console.log('\n✓ Checking Frontend Dependencies...');
const frontendPackageJsonPath = path.join(__dirname, 'HoraBackend', 'frontend', 'package.json');
if (fs.existsSync(frontendPackageJsonPath)) {
  console.log('  ✅ Frontend package.json exists');
  const frontendPackageJson = JSON.parse(fs.readFileSync(frontendPackageJsonPath, 'utf8'));
  
  if (frontendPackageJson.dependencies.axios) {
    console.log('  ✅ axios dependency found');
  } else {
    console.log('  ❌ axios dependency missing');
    console.log('     Run: npm install axios');
    allGood = false;
  }
  
  const requiredDeps = ['react', 'react-router-dom'];
  requiredDeps.forEach(dep => {
    if (frontendPackageJson.dependencies[dep]) {
      console.log(`  ✅ ${dep} dependency found`);
    } else {
      console.log(`  ⚠️  ${dep} dependency missing`);
    }
  });
} else {
  console.log('  ❌ Frontend package.json not found');
  allGood = false;
}

// Check 5: Frontend API service
console.log('\n✓ Checking Frontend API Service...');
const apiServicePath = path.join(__dirname, 'HoraBackend', 'frontend', 'src', 'services', 'api.js');
if (fs.existsSync(apiServicePath)) {
  console.log('  ✅ API service file exists (src/services/api.js)');
} else {
  console.log('  ❌ API service file not found');
  console.log('     Expected at: src/services/api.js');
  allGood = false;
}

// Check 6: Frontend Auth Context
console.log('\n✓ Checking Frontend Auth Context...');
const authContextPath = path.join(__dirname, 'HoraBackend', 'frontend', 'src', 'contexts', 'AuthContext.jsx');
if (fs.existsSync(authContextPath)) {
  console.log('  ✅ Auth context file exists (src/contexts/AuthContext.jsx)');
} else {
  console.log('  ❌ Auth context file not found');
  console.log('     Expected at: src/contexts/AuthContext.jsx');
  allGood = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('\n✅ All checks passed! You\'re ready to run the application.\n');
  console.log('Next steps:');
  console.log('1. Terminal 1: cd HoraBackend/backend && npm install && npm start');
  console.log('2. Terminal 2: cd HoraBackend/frontend && npm install && npm run dev');
  console.log('\nBackend: http://localhost:5000');
  console.log('Frontend: http://localhost:5173\n');
} else {
  console.log('\n❌ Some checks failed. Please review the issues above.\n');
  console.log('Please fix the issues and run this script again.\n');
  process.exit(1);
}
