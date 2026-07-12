import { Devvit } from '@devvit/public-api';

Devvit.configure({
	redis: true,
	http: true,
});

Devvit.addMenuItem({
	label: 'Play Ancient Beast',
	description: 'Find an opponent and duel online',
	location: 'subreddit',
	onPress: async (_event, context) => {
		try {
			const playerId = context.userId?.trim() || 'anon';
			const res = await fetch('/internal/queue/join', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ playerId }),
			});
			const text = await res.text();
			context.ui.showToast(`status=${res.status} body=${text.slice(0, 120)}`);
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			context.ui.showToast(`queue error: ${msg.slice(0, 120)}`);
		}
	},
});
