# Arkyra NodeJS SDK

This is the NodeJS SDK for [Arkyra](https://arkyra.pro).

You can start by installing the package:

```bash
npm install @arkyra/node
```

## Usage
```typescript
import Arkyra from '@arkyra/node';
const arkyra = new Arkyra('your api key', 'your self-hosted instance (optional)');
```

The available methods are:
- `post(posts: CreatePostDto)` - Schedule a post to Arkyra
- `postList(filters: GetPostsDto)` - Get a list of posts
- `upload(file: Buffer, extension: string)` - Upload a file to Arkyra
- `integrations()` - Get a list of connected channels
- `deletePost(id: string)` - Delete a post by ID

Alternatively you can use the SDK with curl, check the [Arkyra API documentation](https://docs.arkyra.pro/public-api) for more information.