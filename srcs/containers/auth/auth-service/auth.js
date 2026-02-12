import jwt from 'jsonwebtoken';
import { readSecret } from './server.js';


async function isLogged(request) {
  try {
    const token = request.cookies.access_token;
    if (!token) return false;
    
    const decoded = jwt.verify(token, readSecret(process.env.JWT_SECRET_FILE));
    request.user = decoded;
    return true;
  } catch {
    return false;
  }
}


function checkActiveSession(req) {
  const existingToken = req.cookies.access_token;
  if (existingToken) {
    try {
      jwt.verify(existingToken, readSecret(process.env.JWT_SECRET_FILE));
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
}

export default { 
    isLogged,
    checkActiveSession
}