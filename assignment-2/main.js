
class Button extends React.Component {
  render() {
    return (
      <button className="Button" value={this.props.value} onClick={e => this.props.onClick(this.props.value)}>
        {this.props.value}
      </button>
    );
  }
}

class Calculator extends React.Component {
    constructor(){
        super();

        this.state = {
            result: "0"
        }
		setTimeout(() => {
			this.setState({
				result: "Hello :)"
			})
		}, 30000) // time in milliseconds
    }
	onClick( numberOrOperation) {
		
		const { result } = this.state
		
        if( numberOrOperation === "Clear" ){		
			this.setState({
				result: "0"
			})
        }

        else if(numberOrOperation === "="){
            this.calculate()
        }

        else {
            if(result == "0")
			{
				this.setState({
					result: numberOrOperation
				})
				
			}
			else
			{			
				this.setState({
					result: this.state.result + numberOrOperation
				})
			}
        }
    }
    calculate() {
        try {
            this.setState({
                result: (eval(this.state.result) || "" ) + ""
            })
        } catch (e) {
            this.setState({
                result: "error"
            })

        }
    }

    reset() {
        this.setState({
            result: ""
        })
    }
    render() {
		const { result } = this.state
        return (
            <div className="Buttons">
				<p>{result}</p>
				<br/>
                <Button value="Clear" onClick={e => this.onClick("Clear")}>Clear</Button>
                <Button value="/" onClick={e => this.onClick("/")}>/</Button><br/>
				
                <Button value="1" onClick={e => this.onClick(1)}>1</Button>
                <Button value="2" onClick={e => this.onClick(2)}>2</Button>
                <Button value="3" onClick={e => this.onClick(3)}>3</Button>
                <Button value="*" onClick={e => this.onClick("*")}>*</Button><br/>

                <Button value="4" onClick={e => this.onClick(4)}>4</Button>
                <Button value="5" onClick={e => this.onClick(5)}>5</Button>
                <Button value="6" onClick={e => this.onClick(6)}>6</Button>
                <Button value="-" onClick={e => this.onClick("-")}>-</Button><br/>

                <Button value="7" onClick={e => this.onClick(7)}>7</Button>
                <Button value="8" onClick={e => this.onClick(8)}>8</Button>
                <Button value="9" onClick={e => this.onClick(9)}>9</Button>
                <Button value="+" onClick={e => this.onClick("+")}>+</Button><br/>

                <Button value="0" onClick={e => this.onClick("0")}>0</Button>
                <Button value="=" onClick={e => this.onClick("=")}>=</Button>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(){
        super();

        this.state = {
            result: ""
        }
    }
	onClick( value ) {

        if(value === "="){
            this.calculate()
        }

        else if(value === "C"){
            this.reset()
        }
        else if(value === "CE"){
            this.backspace()
        }

        else {
            this.setState({
                result: this.state.result + value
            })
        }
	}
  render() {
    return (
	<div>
	<Calculator />
	</div>
	);
  }
}

 
ReactDOM.render(
  <App />,
  document.getElementById('app')
);