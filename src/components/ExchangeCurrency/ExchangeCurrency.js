import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import './ExchangeCurrency.css';

class ExchangeCurrency extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrData : [],
            temp : [],
            rates : [],
            currencyOption : ["USD","CAD","IDR","GBP","CHF","SGD","INR","MYR","JPY","KRW"],
            initialCurrency : 'USD',
            pickedCurrency : '',
            currencyDesc : '',
            initialValue : 10.00,
            rate2count : 0,
            rateExpected : 0,
            btnDisplay : {display : ''},
            formDisplay : {display : 'none'},
            optDisplay : {display : ''},
            optDisable : false,
            btnDisable : true,
            event : ''
        }
    }

    componentDidMount(){
        axios.get('https://api.exchangeratesapi.io/latest?base='+this.state.initialCurrency)
        .then(response => {
            this.setState({
                rates: response.data.rates,
            })
        }).catch(err => {
            console.log(err);
        });
    }
    
    changeRate(e) {
        const key = e.target.value;
        var selectedDesc = '';
        if (key === 'USD') selectedDesc = 'United State Dollar'
        else if (key === 'CAD') selectedDesc = 'Canadian Dollar'
        else if (key === 'IDR') selectedDesc = 'Indonesia Rupiah'
        else if (key === 'GBP') selectedDesc = 'Pound sterling'
        else if (key === 'CHF') selectedDesc = 'Swiss Franc'
        else if (key === 'SGD') selectedDesc = 'Singapore Dollar'
        else if (key === 'INR') selectedDesc = 'Indian Rupee'
        else if (key === 'MYR') selectedDesc = 'Malaysian Ringgit'
        else if (key === 'JPY') selectedDesc = 'Japanese Yen'
        else if (key === 'KRW') selectedDesc = 'South Korean Won'
        this.setState(state => {
            state.rate2count = this.state.rates[key];
            state.pickedCurrency = key;
            state.currencyDesc = selectedDesc;
            return state;
        });
    }

    btnDisplayOn() {  
        this.setState(state => {
            state.btnDisplay = {display : ''};
            state.formDisplay = {display : 'none'};
            return state;
        });
    }

    deleteItem(e, i) {
        const items = [...this.state.arrData];
        const valueToRemove = i;
        const filteredItems = items.filter((x,item) => item !== valueToRemove)
        this.setState(state => {
            state.arrData = filteredItems
            return state;
        })
    }

    btnClicked(){
        this.setState(state => {
            state.btnDisplay = {display : 'none'};
            state.formDisplay = {display : ''};
            return state;
        });
    }

    changeInitialValue(e) {
        const newIV = e.target.value
        this.setState(state => {
            state.initialValue = newIV
            return state;
        })
    }

    disableOpt() {
        this.setState(state => {
            state.optDisable = true;
            return state;
        })
    }

    dataUpdate() {
        this.setState(state => {
            state.temp = [this.state.pickedCurrency, this.state.currencyDesc,this.state.rate2count]
            return state;
        })
    }

    validation() {
        if (this.state.temp !== [])
        this.setState(state => {
            state.btnDisable = false;
            return state;
        })
    }
    
    updateItem() {
        this.state.arrData.push(this.state.temp)
        this.setState(state => {
            state.pickedCurrency = ''
        })
    }

    onSelect(e) {
        this.changeRate(e);
        this.dataUpdate();
        this.validation();
    }

    onSubmit(e){
        this.updateItem();
        this.btnDisplayOn();
    }


    render(){
        return (
            <div className = 'feca'>
                <div className = 'feca-initalCurrency'>
                    <div className = 'feca-initalCurrency-desc'>USD - United State Dollar</div>
                    <div className = 'flex-container'>
                        <div className = 'feca-initalCurrency-currencyTitle'>{this.state.initialCurrency}</div>
                        <div className = 'feca-initalCurrency-valueTile'>
                            <input className = 'feca-initalCurrency-valueTile-input' type="number" name="initialValue" onChange={(e) => this.changeInitialValue(e)} value = {this.state.initialValue}/>
                        </div>
                    </div>
                </div>
                <div className = 'feca-exchangeRateDisplay'>
                    <ul className = 'feca-exchangeRateDisplay-ul'>
                        {/* 
                        data2show[0] = Currency
                        data2show[1] = Currency Description
                        data2show[2] = Exchange Rate
                        */}
                        {this.state.arrData.map((data2show, i) => 
                        <li className='feca-exchangeRateDisplay-ul-li' key = {i}>
                            <div className = 'flex-container'>
                                <div className = 'feca-exchangeRateDisplay-item'>
                                    <div className = 'feca-exchangeRateDisplay-item-detail'>
                                        <div className = 'flex-container'>
                                            <div className = 'feca-exchangeRateDisplay-item-detail-currency'>{data2show[0]}</div>
                                            <div className = 'feca-exchangeRateDisplay-item-detail-value'>
                                                <NumberFormat value={data2show[2] * this.state.initialValue} displayType={'text'} thousandSeparator={true} decimalScale = {2}/>
                                            </div>
                                        </div>
                                        <div className = 'feca-exchangeRateDisplay-item-detail-desc'>
                                            {data2show[0]} - {data2show[1]}
                                        </div>
                                        <div className = 'feca-exchangeRateDisplay-item-detail-rate'>
                                            1 {this.state.initialCurrency} = <NumberFormat value={data2show[2]} displayType={'text'} thousandSeparator={true} decimalScale = {2}/> {data2show[0]}
                                        </div>
                                    </div>
                                </div>
                                <div className = 'feca-exchangeRateDisplay-item-delete'>
                                    <button className = 'feca-exchangeRateDisplay-item-delete-btn' onClick = {(e) => this.deleteItem(e, i)}>(-)</button>
                                </div>
                            </div>
                        </li>)}
                    </ul>
                </div>
                <div className = 'feca-addMore'>
                    <div className = 'feca-addMore-btn' style = {this.state.btnDisplay}>
                        <button onClick = {() => this.btnClicked()}>(+) Add More Currencies</button>
                    </div>
                    <div className = 'feca-addMore-form' style = {this.state.formDisplay}>
                        <input type="text" list="currencies" placeholder = "Choose Currency" className = 'feca-addMore-form-dropdown' value = {this.state.pickedCurrency} onChange={(e) => this.onSelect(e)}/>
                        <datalist id="currencies">
                            {this.state.currencyOption.map((op, i) => <option key={i}>{op}</option>)}
                        </datalist>
                        <button className = 'feca-addMore-form-submit' disabled = {this.state.btnDisable} onClick = {(e) => this.onSubmit(e)}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExchangeCurrency;