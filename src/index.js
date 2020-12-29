
import { toBlob } from '@denyncrawford/html-to-image';

const entry = ({
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
  RunningConfig.data.editorContextMenuButtons.push({
    label: "New Polacode",
    action() {
      let editor = RunningConfig.data.focusedEditor.instance;
      let selection = editor.getSelection();
      let mode = editor.getOption("mode");
      const mounted = async () => {
        let theme =
          PluginsRegistry.registry.data.list[StaticConfig.data.appTheme]
            .textTheme;
        // StaticConfig.keyChanged(
        //   "appTheme",
        //   (nuevoTema) => console.log(nuevoTema),
        // );
        let ta = document.querySelector("#polacodeCodemirror");
        let cm = CodeMirror.fromTextArea(ta, {
          theme,
          mode,
          cursorBlinkRate: -1,
        });
        cm.setValue(selection);
        cm.setOption("readOnly", "nocursor");
        let node = cm.getWrapperElement()
        let blob = await toBlob(node, {
          pixelRatio: 3
        })
        navigator.clipboard.write([
          new ClipboardItem({
              'image/png': blob
          })
      ]);
      };
      new Tab({
        title: "Polacode",
        component() {
          const myStyles = style`
            & {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              flex-direction: column;
            }

            & h1 {
              margin-top: 100px;
            }

            & #polacode {
              padding: 20px;
              background-color: rgb(0 0 0 / 6%);
              width: 700px;
              margin-top: 50px;
              border-radius: 10px;
              zoom: 0.6;
              user-select: none;
            }
          `;
          return element`<div class="${myStyles}" mounted="${mounted}">
                          <h1>Polacode: Code Snapshots</h1>
                          <p>This is a snapshot of your code!</p>
                          <div id="polacode">
                            <textarea id="polacodeCodemirror"></textarea>
                          </div>
                         </div>`;
        },
      });
    },
  });
};

export { entry };