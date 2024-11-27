// Generated by Wrangler by running `wrangler types --env-interface CloudflareEnv env.d.ts`

interface CloudflareEnv {
	SPEECHR_AUTH_KV: KVNamespace;
	TURSO_DATABASE_URL: string;
	TURSO_AUTH_TOKEN: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	CLIENT_REDIRECT_URL: string;
	TTS_PROVIDER_URL: string;
	TTS_CALLBACK_URL: string;
	STORAGE: R2Bucket;
}
