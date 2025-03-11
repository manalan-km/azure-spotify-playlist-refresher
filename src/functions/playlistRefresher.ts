import { app, InvocationContext, Timer } from "@azure/functions";

export async function playlistRefresher(myTimer: Timer, context: InvocationContext): Promise<void> {
    // context.log('Timer function processed request.');
    console.log('Timer Function executed meow meow');
}

app.timer('playlistRefresher', {
    schedule: '0 */1 * * * *',
    handler: playlistRefresher
});
