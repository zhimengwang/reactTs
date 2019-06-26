import * as React from 'react';
import * as styles from "./layout.component.scss"

class App extends React.Component<{}> {
    render() {
        return (
            <div className={styles.layout}>
                <div className="left">1</div>
                <div className="center">2</div>
                <div className="right">3</div>
            </div>
        );
    }
}

export default App;
