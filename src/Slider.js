import React from 'react';
import {
    Text,
    View,
} from 'react-vr';

const DEFAULT_HOVER_COLOR = "#0275d8";
const DEFAULT_ACTIVE_COLOR = "#FF69B4";

export default class Slider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            innerCounter: 0,
            outerCounter: 0,
            offsetReal: this.props.value || 0,
            offsetInner: 0,
            offsetOuter: this.props.value || 0,
            maxValue: this.props.maxValue || 100,
            minValue: this.props.maxValue || 100,
            step: this.props.step || 10,
            sliding: false,
            currentBackgroundColor: DEFAULT_HOVER_COLOR
        };

    }

    componentDidUpdate() {

        this.props.onChange(this.state.offsetReal);

    }

    calcStep(currentOffset, maxValue) {

        let x1, x2, y1, y2;

        x1 = 0; x2 = 100; y1 = 0; y2 = maxValue;

        const k = (y1 - y2) / (x1 - x2);
        const b = y2 - k * x2;

        return Math.round(k * currentOffset + b)
    }

    move(event) {
        if (this.state.sliding) {

            let roundOffset = event.nativeEvent.offset[0] * 100;
            console.log(roundOffset);

            let offsetOuter = this.calcStep(roundOffset, this.state.maxValue);

            if ((this.state.offset - this.state.offsetOuter) >= this.state.step) {
                this.setState({
                    offsetOuter: this.state.outerCounter * this.state.step,
                    outerCounter: Math.round(offsetOuter / this.state.step),
                    offsetReal: this.state.outerCounter * this.state.step
                });
            }

            this.setState({ offset: offsetOuter });


        }
    }



    outerMove(event) {
        let offset = event.nativeEvent.offset[0];
        let offsetOuter = this.state.offsetOuter;
        let newOffset = Math.round(offset * offsetOuter);

        if (this.state.sliding) {

            if ((this.state.offset - this.state.offsetOuter) <= this.state.step * -1)
                this.setState({
                    offsetOuter: this.state.outerCounter * this.state.step,
                    outerCounter: Math.round(newOffset / this.state.step),
                    offsetReal: this.state.outerCounter * this.state.step
                });

            this.setState({ offset: newOffset });
        }
        //console.log(Math.round(event.nativeEvent.offset[0]*100));
    }

    interact(event) {
        if (event.nativeEvent.inputEvent.eventType == 'click')
            this.setState({
                sliding: !this.state.sliding,
                currentBackgroundColor: this.state.sliding ? DEFAULT_HOVER_COLOR : DEFAULT_ACTIVE_COLOR
            })
    }

    render() {


        return (

            <View
                onMove={this.move.bind(this)}
                onInput={this.interact.bind(this)}
                style={{
                    transform: [{ translate: [0.1, -0.1, -0.5] }],
                    layoutOrigin: [0.5, 0.5],
                    height: 0.05,
                    marginBottom: 0.01,
                    width: this.state.maxValue / 1000,
                    backgroundColor: "#eceeef",
                }}>
                <View
                    style={{
                        width: "100%",
                    }}>
                    <View
                        onMove={this.outerMove.bind(this)}
                        onInput={this.interact.bind(this)}
                        style={{
                            alignSelf: 'flex-start',
                            width: this.state.offsetOuter / 1000,
                            height: 0.05,
                            backgroundColor: this.state.currentBackgroundColor

                        }}>

                        <View
                            style={{

                                width: 0.2,
                                height: 0.05,
                            }}>


                        </View>
                    </View>
                </View>
                <Text
                    style={{
                        fontSize: 0.03,
                        width: 100 + "%",
                        height: 0.05,
                        textAlign: 'center',
                        color: '#000',
                        position: 'absolute'
                    }}>{this.state.offsetReal}</Text>
            </View>



        );
    }
};