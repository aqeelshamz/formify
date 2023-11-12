import express from "express";
import "dotenv/config";
import bot from "../config.js";
import handleCreate from "../services/handleCreate.js";
import handleFill from "../services/handleFill.js";

const router = express.Router();


router.get("/endpoint", (req, res) => {
    try {
        console.log("GET: Someone is pinging!");

        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (
            mode &&
            token &&
            mode === "subscribe" &&
            process.env.Meta_WA_VerifyToken === token
        ) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error({ error });
        return res.sendStatus(500);
    }
});

router.post("/endpoint", async (req, res) => {
    try {
        let data = bot.parseMessage(req.body);
        console.log(data);

        if (data?.isMessage) {
            console.log(data);

            let incomingMessage = data.message;
            let recipientPhone = data.contacts.wa_id; // extract the phone number of sender
            let recipientName = data.contacts.profile.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (text, images, responses to buttons etc.)
            let message_id = incomingMessage.message_id; // extract the message id

            // Choose language
            if (typeOfMsg === "textMessage") {
                await bot.sendButtons({
                    message: "Welcome to Formify AI. Do you want to create a new form or fill one?",
                    recipientPhone: recipientPhone,
                    listOfButtons: [
                        {
                            title: "Create new form",
                            id: "create_form",
                        },
                        {
                            title: "Fill a form",
                            id: "fill_form",
                        },
                    ],
                });
            }

            let bot_choice;

            if (typeOfMsg === "replyButtonMessage") {
                bot_choice = await incomingMessage.button_reply.id;
            }

            // mark as read
            await bot.markMessageAsRead({ message_id });

            if (bot_choice === "create_form") {
                handleCreate(data);
            } else {
                handleFill(data);
            }
        }

        console.log("POST: Someone is pinging!");
        return res.sendStatus(200);
    } catch (error) {
        console.error({ error });
        return res.sendStatus(500);
    }
});

export default router;
