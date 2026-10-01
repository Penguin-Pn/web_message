import './DBs.js'
import marked from './marked.min.js'

class MR extends marked.Renderer {
    br() {
        return '&ltbr&gt';
    }
    text(token){
        let t = token.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replace(/\n/g , '<x-br><x-br>');

        t = t.replaceAll(dbs.account.get("id"), `<span class = "call-user">@${dbs.account.get("id")}</span>`);

        t = t.replaceAll('@all', '<span class = "call-user">@all</span>')
      
        t = t.replace(/@([a-zA-Z][a-zA-Z0-9._]{2,}[a-zA-Z0-9])/g, (match, id) => {
            return `<a href="http://${window.location.origin}/${id}">@${id}</a>`;
        });
        
        return t;
    }
    link(token) {
      const { href, title, tokens } = token;
      const text = this.parser.parseInline(tokens);
      return `<button onclick = "Uopen(${href})" class = "lnk">${ text }<button>`;
    }
}

function mr(text) {
    let Mr = new MR();
    return marked.parse(text, { renderer: Mr });
}