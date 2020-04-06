import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/actionHost";

export class PlayGame extends Component {

  componentDidMount() {
    const { questions, numberCurrentQuestion } = this.props.host;
    const t = questions[numberCurrentQuestion].timeAnswer;

    const { setTimeQuestion } = this.props;
    setTimeQuestion(t);

    setInterval(() => {
      this.timeCountDown();
    }, 100);

    const { socket } = this.props.host;
    socket.on("memberAnswer", (data) => {
      const { members } = this.props.host;
      const { memberAnswer } = this.props;
      if (data.isRight) {
        const index = members.findIndex((m) => m.id === data.id);

        members[index] = {
          id: members[index].id,
          nickName: members[index].nickName,
          rightQuestion: members[index].rightQuestion + 1,
          score: members[index].score + 100,
        };
        members.sort(function (a, b) {
          if (a.score > b.score) {
            return -1;
          }
          if (b.score > a.score) {
            return 1;
          }
          return 0;
        });
      }
      memberAnswer(members);
    });
  }
  onClick = () => {
    const { numberCurrentQuestion, questions } = this.props.host;
    const { clickNextQuestion } = this.props;
    const numberQuestion = questions.length;
    if (numberCurrentQuestion < numberQuestion - 1) clickNextQuestion();
  };

  timeCountDown = () => {
    var { time } = this.props.host;
    const { setTimeQuestion } = this.props;
    if (time > 0) setTimeQuestion(time - 1);
  };

  render() {
    var {
      numberCurrentQuestion,
      questions,
      numberMembersAnswer,
      members,
      time,
    } = this.props.host;
    const question = questions[numberCurrentQuestion];
    const numberQuestion = questions.length;
    const numberMembers = members.length;

    var showMembers = members.map((member, i) => {
      return (
        <tbody key={i}>
          <tr>
            <th scope="row">{(i += 1)}</th>
            <td>{member.nickName}</td>
            <td>{member.rightQuestion}</td>
            <td>{member.score}</td>
          </tr>
        </tbody>
      );
    });

    var timeCountDown=(time)=>{
      var min = 0;
      var sec = 0;
  
      if (time >= 60) {
        min = time / 60;
        sec = time % 60;
        if (sec < 10) sec = "0" + sec;
        time=min+''+sec
      } else if (time>0){
        min = '00';
        sec = time;
        if (sec < 10) sec = "0" + sec;
        time=min+':'+sec
      }
      else{
        time="Hết giờ"
      }
      return time;
    }

    return (
      <div className=" row">
        <div className="col-12 col-lg-8  wrapper">
          <h2 className="question">{question.question}</h2>

          <div className="card bg-dark text-white mt-3">
            <h3 className="card-title text-center">
              <div className="d-flex flex-wrap justify-content-center mt-2">
                <span className="pl-3 text-warning">Time:</span>
                <span className="pl-3 pr-3">
                 
                </span>
                
              </div>
            </h3>
          </div>

          <div className="img"></div>
          <div className="answers">
            <button className="btn btn-success col-10 col-sm-5 answer">
              {question.answer1}
            </button>
            <button className="btn btn-success col-10 col-sm-5 answer">
              {question.answer2}
            </button>
            <button className="btn btn-success col-10 col-sm-5 answer">
              {question.answer3}
            </button>
            <button className="btn btn-success col-10 col-sm-5 answer">
              {question.answer4}
            </button>
          </div>
        </div>
        <div className="col-12 col-lg-4 statistic">
          <h1>
            Câu hỏi số: {(numberCurrentQuestion += 1)} / {numberQuestion}
          </h1>
          <h1>
            Số người trả lời:{numberMembersAnswer} /{numberMembers}
          </h1>
          <button
            type="button"
            className="btn btn-primary nextquestion"
            onClick={this.onClick}
          >
            Next question{" "}
            <i className="fa fa-step-forward" aria-hidden="true"></i>
          </button>
          <div className="table-wrapper-scroll-y my-custom-scrollbar">
            <table className="table table-bordered table-striped mb-0">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Nick Name</th>
                  <th scope="col">Số câu trả lời đúng</th>
                  <th scope="col">Điểm số</th>
                </tr>
              </thead>
              {showMembers}
            </table>
          </div>
        </div>
      </div>
    );
  }
}
const mapStatetoProps = (state) => {
  return {
    host: state.host,
  };
};

const mapDispathToProps = (dispatch, props) => {
  return {
    setTimeQuestion: (time) => {
      dispatch(actions.setTimeQuestion(time));
    },

    clickNextQuestion: (numberCurrentQuestion) => {
      dispatch(actions.clickNextQuestion(numberCurrentQuestion));
    },
    memberAnswer: (members) => {
      dispatch(actions.memberAnswer(members));
    },
  };
};
export default connect(mapStatetoProps, mapDispathToProps)(PlayGame);
