import { sticker } from "../lib/sticker.js";

let handler = async(m, { text }) => {
    let teks = m.quoted ? m.quoted.text : text;
    
    // Check if there's no text and provide an example
    if (!teks) throw "Example: .brat Owner tamvan";
    
    // Start loading state with a reaction (loading emoji)
    await m.react("⏳");

    try {
        // Prepare the base URL for the API request
        let URLS = `https://brat.caliphdev.com/api/brat/animate?text=`;

        // Combine the original text (teks) with the watermark (kevin)
        let request = await sticker(false, URLS + teks, global.packname, global.author);  // Add kevin (watermark) to the URL

        // Send the generated sticker as a reply
        await m.reply(request);

        // Once the sticker is sent, update the reaction to success
        await m.react("✅");

    } catch (error) {
        // If there’s an error, handle it gracefully
        console.error(error);
        await m.reply("An error occurred while processing your request. Please try again later.");
        
        // Optionally react with a failure emoji
        await m.react("❌");
    }
}

handler.help = ["bratgif", "bratvideo"];
handler.tags = ["sticker"];
handler.command = /^(bratgif|bratvideo)$/i;

handler.limit = true;  // Limits for the command usage
handler.register = true;  // Registration for the command (if needed in your system)

export default handler;