import { marked } from "marked";

// admonition types
const types = ["info", "danger", "warning", "success", "note"];

const startRegExp = new RegExp(`^!!!\\s+(${types.join('|')})\\s+(.*)$`);
const endRegExp = new RegExp("^!!!\s*$");

// FIXME
const debug = false;

const myAdmonitionPlugin = {
  name: "note",
  level: "block",
  start(src) {
    let _a;
    const index = (_a = src.match(new RegExp(`(^|[\\r\\n])!!!\\s+(${types.join('|')})\\s+(.*)`))) === null || (_a && _a.index);
    // TODO debug?
    debug && console.log("🎋[marked start]", src, index);
    return index;
  },
  tokenizer(src, _tokens) {
    // TODO debug?
    debug && console.log('🗼[marked tokenizer]', src, _tokens);
    const lines = src.split(/\n/);
    if(startRegExp.test(lines[0])) {
        const section = { x: -1, y: -1 };
        const sections = [];
        for (let i = 0, k = lines.length; i < k; i++) {
            if (startRegExp.test(lines[i])) {
                section.x = i;
            }
            else if (endRegExp.test(lines[i])) {
                section.y = i;
                if (section.x >= 0) {
                    sections.push(Object.assign({}, section));
                    section.x = -1;
                    section.y = -1;
                }
            }
        }
        if (sections.length) {
            const section = sections[0];
            const [_, icon, title] = startRegExp.exec(lines[section.x]) || [];
            const text = lines.slice(section.x + 1, section.y).join('\n');
            const raw = lines.slice(section.x, section.y + 1).join('\n');
            const token = {
                type: 'note',
                raw,
                icon,
                title,
                text,
                titleTokens: [],
                tokens: [],
                childTokens: ['title', 'text'],
            };
            this.lexer.inlineTokens(token.title, token.titleTokens);
            this.lexer.blockTokens(token.text, token.tokens);
            return token;
        }
    }
  },
  renderer(token) {
    // TODO debug?
    debug && console.log('🐉[marked renderer]', this, token);
    return `<div class="note note-${token.icon}">
                <p class="note-title">${this.parser.parseInline(token.titleTokens, null)}</p>
                <div class="note-body">
                    ${this.parser.parse(token.tokens)}
                </div>
            </div>`;
    },
};

const extensions = [myAdmonitionPlugin] ;
export default {
    extensions
};