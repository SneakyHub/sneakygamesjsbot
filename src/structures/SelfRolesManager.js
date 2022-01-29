const SGClient = require("./SGClient");
const uuid = require('uuid').v4;

module.exports = class SelfRolesManager {

    /**
     * @param {SGClient} client 
     */
    constructor(client) {
        this.client = client; // initialize client property.
        // all self roles must be loaded in Ready event.
    }

    // load self roles, this function fetches all the 
    async loadSelfRoles() {
        // check if there's no collection with 'selfroles', if not, create it.
        if(!(await this.client.db.get('selfroles'))) await this.client.db.set('selfroles', [], -1);
        let data = await this.getData();
        data.forEach(async d => {
            let c = this.client.channels.cache.get(d.channelId);
            if(!c) return;
            try {
                await c.messages.fetch(d.messageId);
            } catch (err) {}
        })
    }

    async saveData(newData) {
        return await this.client.db.set('selfroles', newData);
    }

    async deleteSelfRoleById(roleId) {
        let data = await this.getData();
        let selfRole = data.find(a => a.roleId == roleId);
        if(!selfRole) return false;
        data = data.filter(a => a.roleId != roleId);
        await this.saveData(data);
        return true;
    }

    async deleteSelfRoleByUuid(uuid) {
        let data = await this.getData();
        let selfRole = data.find(a => a.id == uuid);
        if(!selfRole) return false;
        data = data.filter(a => a.id != uuid);
        await this.saveData(data);
        return true;
    }

    async saveSelfRole(newData) {
        let data = await this.getData();
        data.push(newData);
        await this.saveData(data);
    }

    async getSelfRolesByMessageId(messageId) {

        let data = await this.getData();
        let selfRoles = data.filter(a => a.messageId == messageId);
        return selfRoles;

    }

    async getSelfRolesByEmojiName(emoji) {

        let data = await this.getData();
        let selfRoles = data.filter(a => a.emoji == emoji);
        return selfRoles;

    }

    async getSelfRoles(guildId) {

        let data = await this.getData();
        let selfRoles = data.filter(a => a.guildId == guildId);
        return selfRoles;

    }

    async getSelfRolesById(roleId) {

        let data = await this.getData();
        let selfRoles = data.filter(a => a.roleId == roleId);
        return selfRoles;

    }

    async getSelfRolesByUuid(uuid) {

        let data = await this.getData();
        let selfRoles = data.filter(a => a.id == uuid);
        return selfRoles;

    }

    async getData() {
        return await this.client.db.get('selfroles');
    }

    getSelfRoleTemplate() {
        return {
            id: uuid(),
            channelId: null,
            guildId: null,
            messageId: null,
            roleId: null,
            emoji: null
        }
    }

}