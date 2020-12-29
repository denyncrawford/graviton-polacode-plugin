import { toBlob } from '@denyncrawford/html-to-image';
import getStyles from './styles'

export const entry = ({
  Tab,
  ContexMenu,
  RunningConfig,
  StaticConfig,
  CodeMirror,
  PluginsRegistry,
  puffin: {
    element,
    style,
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

          async function mounted(){
            const { textTheme: theme } = PluginsRegistry.registry.data.list[StaticConfig.data.appTheme]
            // StaticConfig.keyChanged(
            //   "appTheme",
            //   (nuevoTema) => console.log(nuevoTema),
            // );
            
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
            
            const node = this.children[2].children[0]
            const blob = await toBlob(node, {
              pixelRatio: 5,
              backgroundColor: 'rgb(255,255,255)'
            })
            
            navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ])
          };
          
          return element`
           <div class="${myStyles}" mounted="${mounted}">
             <h1>Polacode: Code Snapshots</h1>
             <p>This is a snapshot of your code!</p>
             <div class="demo">
               <div id="polacode">
                 <div class="container">
                   <textarea id="polacodeCodemirror"></textarea>
                 </div>
               </div>
             </div>
           </div>`;
        },
      });
    },
  });
};
