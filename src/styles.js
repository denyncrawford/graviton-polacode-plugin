export default function getStyles(style){
  return style`
    & {
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     flex-direction: column;
    }
    & > * {
      color: var(--textColor);
    }
    & p {
      margin: 0 auto;
      max-width: 400px;
      text-align: center;
    }
    & #polacode {
      width: auto;
      border-radius: 5px;
      user-select: none;
      background: white;
      padding: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    & #polacode .container {
      background: var(--mainpanelBackground);
      border-radius: 7px;
      box-shadow: 0px 2px 7px rgba(0,0,0,0.3);
      zoom: 0.8;
      padding: 12px 20px;
      flex: 1;
    }
    & *:not(.demo)::-webkit-scrollbar {
      display: none !important;
      visibility: hidden !important; 
    }
    & *:not(.demo){
      overflow: hidden !important;
    }
    & .demo {
      overflow: auto;
      max-height: 500px;
      flex-grow: row;
      margin: 25px 0;
    }
    & .CodeMirror {
      font-size: 12px;
    } 
    & .CodeMirror-cursors{
      display: none !important;
    }
    & .CodeMirror .cm-tab{
      border-left: 0px;
    }
    & .savePolacode {
      margin-top: 0;
    }
 `;
}