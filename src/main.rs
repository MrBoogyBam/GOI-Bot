use std::env;

use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::prelude::*;

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        // If a message sent in the promotions channel does not contain attachments or embeds, it gets deleted.
        if msg.channel_id.to_string() == "448984025776783371" && msg.attachments.is_empty() && msg.embeds.is_empty() {
           let _ = msg.delete(&ctx.http).await;
        }

        // If a message sent in the request roles channel does not contain a speedrun.com link for a goi run, it gets deleted
        if msg.channel_id.to_string() == "910744722144886794" && !msg.content.contains("https://www.speedrun.com/goiwbf/runs/") {
            let _ = msg.delete(&ctx.http).await;
        }
    }

    async fn ready(&self, _: Context, ready: Ready) {
        println!("{} is connected.", ready.user.name);
    }
}

#[tokio::main]
async fn main() {
    let token = env::var("GOI_BOT_TOKEN").expect("Could not find token in environment variables");
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;
    
    let mut client = Client::builder(&token, intents).event_handler(Handler).await.expect("Error creating client");

    if let Err(why) = client.start().await {
        println!("Client error: {why:?}");
    }
}