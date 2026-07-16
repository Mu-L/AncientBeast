import { reddit } from '@devvit/web/server';

export async function createPost() {
	return await reddit.submitCustomPost({
		title: `Ancient Beast 🐺 You're about to get Hooked! 🪝`,
	});
}
