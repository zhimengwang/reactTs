import * as React from 'react';

import { DatePicker , Button } from 'antd';


import PageInterface from '../PageInterface';
import LayoutComponent from  './layout/layout.component'
class App extends React.Component<PageInterface, {}> {
    render() {
        return (
            <div>
                <DatePicker/>
                <Button>123</Button>
                <LayoutComponent/>
            </div>
        );
    }
}

export default App;
