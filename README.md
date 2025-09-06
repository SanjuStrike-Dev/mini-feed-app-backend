# Mini Feed App - Backend API

A simple Node.js REST API for the Mini Feed App built with Express.js, MongoDB, and JWT authentication.

## Features

- **User Authentication**: Registration and login with static OTP (123456)
- **JWT Authentication**: Simple token-based authentication
- **Posts Management**: Create and fetch posts
- **User Profiles**: Basic profile fetching
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, Helmet, Rate Limiting
- **Image Support**: Base64 image storage

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with OTP (use 123456)

### Profile
- `GET /me` - Get user profile

### Posts
- `POST /posts` - Create a new post
- `GET /posts` - Get all posts
- `GET /posts?mine=true` - Get user's posts

### Health Check
- `GET /health` - API health check

## Data Models

### User
```javascript
{
  _id: ObjectId,
  mobile: String (unique, required),
  name: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Post
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  description: String (required),
  imageUrl: String (optional),
  imageBase64: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend folder**
   ```bash
   cd mini-feed-app-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mini-feed-app
   JWT_SECRET=mini-feed-app-super-secret-jwt-key-2024
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   - Local MongoDB: Make sure MongoDB is running on your system
   - Cloud MongoDB: Use your MongoDB Atlas connection string

5. **Start the server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Usage Examples

### Register a User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+1234567890",
    "name": "John Doe"
  }'
```

### Login with OTP
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+1234567890",
    "otp": "123456"
  }'
```

### Create a Post (with JWT token)
```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "My first post!",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  }'
```

### Get User's Posts
```bash
curl -X GET "http://localhost:5000/posts?mine=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
mini-feed-app-be/
├── models/              # MongoDB models
│   ├── User.js         # User schema
│   └── Post.js         # Post schema
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── posts.js        # Posts routes
│   └── profile.js      # Profile routes
├── middleware/         # Express middleware
│   └── auth.js         # JWT authentication
├── server.js           # Express server setup
├── package.json        # Dependencies
└── README.md          # This file
```

## Dependencies

### Production
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT token handling
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **express-rate-limit**: Rate limiting
- **dotenv**: Environment variables

### Development
- **nodemon**: Development server with auto-restart

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for frontend domains
- **Rate Limiting**: API protection against abuse
- **Helmet**: Security headers
- **Input Validation**: Server-side validation
- **Environment Variables**: Secure configuration

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

Success responses:

```javascript
{
  "success": true,
  "message": "Success description",
  "data": { ... }
}
```

## Testing

### Manual Testing
1. **Start the server**: `npm start`
2. **Test registration**: Use the curl examples above
3. **Test login**: Use OTP `123456`
4. **Test post creation**: Create posts with images
5. **Test post fetching**: Retrieve user's posts

### Health Check
```bash
curl http://localhost:5000/health
```

## Deployment

### Environment Variables for Production
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-feed-app
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Platforms
- **Railway**: Easy deployment with MongoDB


## Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Adding New Features
1. Create new routes in `routes/` directory
2. Add middleware in `middleware/` directory
3. Create models in `models/` directory
4. Update server.js to include new routes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header

3. **CORS Errors**
   - Update FRONTEND_URL in `.env`
   - Check CORS configuration in server.js

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process: `lsof -ti:5000 | xargs kill`

## Future Enhancements

- **Real OTP System**: SMS/Email verification instead of static OTP
- **File Upload**: Multer for handling file uploads
- **Image Processing**: Sharp for server-side image optimization
- **Caching**: Redis for improved performance
- **Logging**: Winston for comprehensive logging
- **Testing**: Jest and Supertest for API testing
- **Documentation**: Swagger/OpenAPI documentation
- **Monitoring**: Health checks and metrics
- **Rate Limiting**: Advanced rate limiting strategies
- **Database Optimization**: Indexing and query optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, please open an issue in the repository.