import { handleBookCall } from '../../server/bookCall.ts';

export async function handler(event: {
  httpMethod: string;
  headers?: Record<string, string | undefined> | null;
  queryStringParameters: Record<string, string | undefined> | null;
  body: string | null;
}) {
  const headers = event.headers ?? {};
  const forwarded = headers['x-nf-client-connection-ip'] || headers['client-ip'] || headers['x-forwarded-for'];
  const result = await handleBookCall({
    method: event.httpMethod,
    query: event.queryStringParameters ?? {},
    body: event.body,
    ip: forwarded?.split(',')[0]?.trim(),
  });
  return {
    statusCode: result.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: result.status === 204 ? '' : JSON.stringify(result.body),
  };
}
