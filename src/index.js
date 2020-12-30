import { toBlob, toPng } from '@denyncrawford/html-to-image';
import getStyles from './styles'
import { writeFile as syncWriteFIle } from 'fs';
import { promisify } from 'util'

const writeFile = promisify(syncWriteFIle)

export const entry = ({
  Tab,
  ContextMenu,
  RunningConfig,
  StaticConfig,
  CodeMirror,
  PluginsRegistry,
  Notification,
  Dialogs: { 
    saveFileAs
  },
  puffin: {
    element,
    style,
  },
  drac: { 
    Button 
  },
}) => {
  
  // Load styles
  const myStyles = getStyles(style)
  
  RunningConfig.data.editorContextMenuButtons.push({
    label: 'New polacode',
    id: Math.random(),
    action() {
      const editor = RunningConfig.data.focusedEditor.instance;
      const selection = editor.getSelection();
      const mode = editor.getOption('mode');
      
      RunningConfig.emit('command.newPanel')

      new Tab({
        title: '🤠 PolaCode',
        component() {
          
          let blob;
          let node;

          // Context menu

          const onContextMenu = event =>  {
            new ContextMenu({
              list: [
                {
                  label: 'Copy Polacode',
                  action() {
                    copy(blob)
                  }
                }
              ],
              event,
              parent: document.body
            })
          }

          // Save File

          const save = async () => {
            // Using this module is not nice
            let image = await toPng(node, {
              pixelRatio: 5,
              backgroundColor: 'rgb(255,255,255)'
            })
            const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            const filename = await saveFileAs({
              title: "polacode",
              filters: [
                { name: 'PNG Files', extensions: ['png'] },
              ]
            });
            await writeFile(filename, base64Data, 'base64')
            new Notification({
              title: 'Saved Polacode',
	            content: `The file was saved to ${filename}`,
            })
          }

          // Mounted

          async function mounted(){
            const { textTheme: theme } = PluginsRegistry.registry.data.list[StaticConfig.data.appTheme]
            
            const CodeMirrorWrapper = document.getElementById('polacodeCodemirror')

            const CodeMirrorInstance = CodeMirror.fromTextArea(CodeMirrorWrapper, {
              theme,
              mode,
              cursorBlinkRate: -1,
              scrollbarStyle: null,
              tabSize: StaticConfig.data.editorTabSize,
              readOnly: 'nocursor'
            });
            CodeMirrorInstance.setValue(selection)
            
            node = this.children[2].children[0]
            blob = await toBlob(node, {
              pixelRatio: 5,
              backgroundColor: 'rgb(255,255,255)'
            })     

            copy(blob)

          };
          
          return element({ components: { Button }})`
           <div class="${myStyles}" mounted="${mounted}">
             <h1>Polacode: Code Snapshots</h1>
             <p>This is a snapshot of your code! It is now on the clipboard, 
             if you want to copy again, do right click over the sanpshot.</p>
             <div class="demo">
               <div :contextmenu="${onContextMenu}" id="polacode">
                 <div class="container">
                   <textarea id="polacodeCodemirror"></textarea>
                 </div>
               </div>
             </div>
             <div id="savePolacode">
               <Button :click="${save}">Save</Button>            
             </div>
           </div>`;
        },
      });
    },
  });
};

const copy = blob => {
  navigator.clipboard.write([
    new ClipboardItem({
      'image/png': blob
    })
  ])
}