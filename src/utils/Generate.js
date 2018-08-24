/**
 * Permet de faire de simples générations
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

const CARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DEFAULT_LENGTH = 32

export default {
    key: (length) => {
        var text = '';

        for (var i = 0; i < (length || DEFAULT_LENGTH); i++)
            text += CARACTERS.charAt(Math.floor(Math.random() * CARACTERS.length));

        return text;
    },

    UUIDv4: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        })
    },

    searchText: (text) => {
        return text.replace(/[^A-Za-zÀ-ž0-9-_#]+/g, ' ').replace('  ', ' ')
    },

    searchTagsText: (text) => {
        return text.replace(/[^A-Za-zÀ-ž0-9-_#]+/g, ' ').replace('  ', ' ').replace(' ', ' #').replace('##', '#')
    },
}
