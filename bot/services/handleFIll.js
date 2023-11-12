import bot from "../config.js";

export const handleFill = async (data) => {
    if (data?.isMessage) {
            console.log(data);

            let incomingMessage = data.message;
            let recipientPhone = data.contacts.wa_id; // extract the phone number of sender
            let recipientName = data.contacts.profile.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (text, images, responses to buttons etc.)
            let message_id = incomingMessage.message_id; // extract the message id

            // Get formId
           await bot.sendText({
                    message: "Type the unique form id to fill response.",
                    recipientPhone: recipientPhone,
            });

            let formId;

            if (typeOfMsg === "text_message") {
                formId = await incomingMessage.message;
            }
            
            console.log(`formId: ${formId}`);
    }

    // Mark messages as read (read receipts)
    await bot.markMessageAsRead({ message_id });
} 