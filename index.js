const { Client, Intents, Permissions, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');

const token = "";//توكن بوتك
const guildId = "";//أيدي سيرفارك
const probotid = "282859044593598464";//أيدي برو بوت
const transferto = "";//أيدي ألي يتحولو الكريدت عند الشراء
const owner = "";//أيدي أونر البوت

client.once('ready', async () => {
    console.log(`Bot Started With Name ${client.user.tag}.`);

    const commands = [
        {
            name: 'buy-project',
            description: 'شراء بروجاكتات',
        },
        {
            name: 'project',
            description: 'رؤية البروجاكتات المتوفرة',
        }
];
 
try {
    const guild = await client.guilds.fetch(guildId);
    const commandsRegistered = await guild.commands.set(commands);
    console.log(`تم تسجيل ${commandsRegistered.size} أمر سلاش.`);
} catch (error) {
    console.error('حدث خطأ أثناء تسجيل أوامر السلاش', error);
}

});

client.on('interactionCreate', async interaction => {
    if (interaction.commandName === 'buy-project') {
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('project_type')
                    .setPlaceholder('أختار من هنا البروجاكت الذي تريد شرائه')
                    .addOptions([
                        {
                            label: 'بروجاكت',
                            value: '1'
                        },
                        {
                            label: 'بروجاكت',
                            value: '2'
                        }
                    ])
            );

        await interaction.reply({ content: '**الرجاء الإختيار بالضغط على الزر في أسفل هذه الرسالة :**', components: [row2] });
    } else if (interaction.commandName === 'project') {
        const projects = new MessageEmbed()
                .setTitle(`**:file_folder: - قائمة البروجاكتات المتوفرة**`)
                .setDescription("**حط هنا أسماء البروجاكتات المتوفرة**")
                .setColor('#0099ff');

            await interaction.reply({ embeds: [projects] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isSelectMenu()) return;
    if (interaction.customId === 'project_type') {
        const selectedOption = interaction.values[0];

        if (selectedOption) {
            
            const ProjectData = {
                1: {
                    name: "بروجاكت 1",//project_name
                    price: 120,//project_price
                    link: "https://youtube.com/@Bleto_YT"//project_link
                },
                2: {
                    name: "بروجاكت 2",//project_name
                    price: 70,//project_price
                    link: "https://www.youtube.com/@Bleto_YT"//project_link
                }
            };
            
            const ProjectData2 = ProjectData[selectedOption];
            const price = ProjectData2.price;
            const pricetax = Math.floor(price * (20) / (19) + (1));

            const transfercredit = new MessageEmbed()
                .setTitle(`**:file_folder: - شراء بروجاكت**`)
                .addField("**نوع البروجاكت :**", `${ProjectData2.name}`)
                .addField("**سعر البروجاكت :**", `${price}`)
                .addField(".", `\`\`\`#credit ${transferto} ${pricetax}\`\`\``)
                .setColor('#0099ff');

            await interaction.reply({ embeds: [transfercredit] });
            
            const filter = (response) =>
                response.author.id === probotid &&
                response.content.includes(`**:moneybag: | ${interaction.user.username}, has transferred \`$${price}\` to <@!${transferto}> **`);

            const collector = await interaction.channel.awaitMessages({ filter, max: 1 });
            const collected = collector.first();
            if (collected) {
                console.log('تحول الكريدت');
                const link = ProjectData2.link;
                const messagedm = new MessageEmbed()
                    .setTitle(`**✅ - تم شراء البروجاكت بنجاح**`)
                    .addField("**نوع البروجاكت :**", `${ProjectData2.name}`)
                    .addField("**سعر البروجاكت :**", `${price}`)
                    .addField("**رابط تحميل البروجاكت :**", `${link}`)
                    .setColor('#0099ff');

                await interaction.user.send({ embeds: [messagedm] });
                
                
                await interaction.channel.send(`**✅ - تم شراء البروجاكت بنجاح**
تم إرسال البروجاكت في الخاص :file_folder:
<@${interaction.user.id}>`);
                
                
            }
        }
    }
});

 
 
client.login(token);
