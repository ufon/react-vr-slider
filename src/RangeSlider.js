import React from 'react';
import {
    Text,
    View,
} from 'react-vr';

const DEFAULT_HOVER_COLOR = "#0275d8";
const DEFAULT_ACTIVE_COLOR = "#FF69B4";

export default class RangeSlider extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            innerCounter: 0,
            outerCounter: 0,
            offsetReal: this.props.value || 0,
            offsetInner: (this.props.value < 0) ? Math.abs(this.props.value) : 0,
            offsetOuter: (this.props.value > 0) ? this.props.value : 0,
            maxValue: this.props.maxValue || 100,
            minValue: this.props.maxValue || 100,
            step: this.props.step || 10,
            sliding: false,
            currentBackgroundColor: this.props.color || DEFAULT_HOVER_COLOR
        };

        this.calcStep = this.calcStep.bind(this);

    }


    componentDidUpdate() {

        this.props.onChange(this.state.offsetReal);

    }

    calcStep(currentOffset, direction, maxValue, minValue) {

        let x1, x2, y1, y2;

        if (direction) {
            x1 = 0; x2 = 50; y1 = minValue; y2 = 0;
        } else {
            x1 = 50; x2 = 100; y1 = 0; y2 = maxValue;
        }

        const k = (y1 - y2) / (x1 - x2);
        const b = y2 - k * x2;

        return Math.round(k * currentOffset + b)

    }

    move(event) {
        if (this.state.sliding) {

            let roundOffset = event.nativeEvent.offset[0] * 100;
            //console.log(roundOffset);

            if (roundOffset > 50) {

                let offsetOuter = this.calcStep(roundOffset, false, this.state.maxValue, this.state.minValue);

                if ((this.state.offset - this.state.offsetOuter) >= this.state.step) {
                    this.setState({
                        offsetOuter: this.state.outerCounter * this.state.step,
                        outerCounter: Math.round(offsetOuter / this.state.step),
                        offsetReal: this.state.outerCounter * this.state.step
                    });
                }

                this.setState({ offsetInner: 0, innerCounter: 0, offset: offsetOuter });


            } else if (roundOffset < 50) {

                let offsetInner = this.calcStep(roundOffset, true, this.state.maxValue, this.state.minValue);
                //console.log(roundOffset, this.state.offsetOuter);
                if ((this.state.offset + this.state.offsetInner) <= this.state.step * -1) {
                    this.setState({
                        offsetInner: this.state.innerCounter * this.state.step,
                        innerCounter: Math.round(offsetInner / this.state.step),
                        offsetReal: this.state.innerCounter * this.state.step * -1
                    });
                }

                this.setState({ offsetOuter: 0, outerCounter: 0, offset: offsetInner * -1 });

            }


        }
    }


    innerMove(event) {
        let offset = event.nativeEvent.offset[0];
        let offsetInner = this.state.offsetInner;
        let newOffset = Math.round(Math.abs(offset - 1) * offsetInner);

        if (this.state.sliding) {

            if ((this.state.offset + this.state.offsetInner) >= this.state.step)
                this.setState({
                    offsetInner: this.state.innerCounter * this.state.step,
                    innerCounter: Math.round(newOffset / this.state.step),
                    offsetReal: this.state.innerCounter * this.state.step * -1
                });

            this.setState({ offset: newOffset * -1, outerCounter: 0 });
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

            this.setState({ offset: newOffset, innerCounter: 0 });
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
                    flex: 1,
                    flexDirection: 'row',
                    width: (this.state.maxValue + this.state.minValue) / 1000,
                    backgroundColor: "#eceeef",
                }}>
                <View
                    style={{
                        width: "50%",
                    }}>
                    <View

                        onMove={this.innerMove.bind(this)}
                        onInput={this.interact.bind(this)}
                        style={{
                            alignSelf: 'flex-end',
                            width: this.state.offsetInner / 1000,
                            height: 0.05,
                            backgroundColor: this.state.currentBackgroundColor

                        }}>

                        <View
                            style={{

                                width: 0.2,
                                height: 0.05,
                            }}>


                        </View>
                    </View >
                </View>
                <View
                    style={{
                        width: "50%",
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