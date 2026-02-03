import jwt from 'jsonwebtoken';

async function isLogged(request) {
    try {
      const token = request.cookies.access_token;
      if (!token) return false;
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
      jwt.verify(existingToken, process.env.JWT_SECRET);
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