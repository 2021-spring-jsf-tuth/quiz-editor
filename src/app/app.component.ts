import { 
  Component
  , OnInit 
} from '@angular/core';
import { updateAwait } from 'typescript';

import { QuizService } from './quiz.service';

interface QuizDisplay {
  name: string;
  questions: QuestionDisplay[];
  markedForDelete: boolean;//to mark each independently for deletion
}

type QuestionDisplay = {
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private quizSvc: QuizService
  ) {}

  quizzes: QuizDisplay[] = [];
  errorLoadingQuizzes = false;
  loading = true;
  
  ngOnInit() {
 this.loadQuizzesForDisplay();
    console.log(this.quizzes);
  }

  async loadQuizzesForDisplay() {
    try{
      //map it to a new object literal with marked for delete button
      this.quizzes =(await this.quizSvc.loadQuizzes()).map(x=>({name: x.name, questions: x.questions, markedForDelete: false}));
      console.log(this.quizzes);
      this.loading =false;
    }
    catch(err){
      console.error(err);
      this.errorLoadingQuizzes = true;
      this.loading = false;
    }
  }

  title = 'quiz-editor';

  selectedQuiz: QuizDisplay = undefined;

  selectQuiz(q) {
    this.selectedQuiz = q;
  }

  addNewQuiz() {

    const newQuiz = {
      name: "Untitled Quiz"
      , questions: []
      , markedForDelete: false
    };

    this.quizzes = [
      ...this.quizzes
      , newQuiz
    ];

    this.selectQuiz(newQuiz);
  }

  removeQuestion(questionToRemove){
    //filter makes a new array with all that evaluate true (all except the question that == this question)
    this.selectedQuiz.questions = this.selectedQuiz.questions.filter(x => x != questionToRemove);

    
  }

  addNewQuestion(){
    this.selectedQuiz.questions = [
      ...this.selectedQuiz.questions, {
        name: "Untitled Question"
      }
    ];
  }

  async jsPromisesOne() {
    const n = this.quizSvc.getMagicNumber(false);
    console.log(n);
    //promises are also called "thenables...."
    n
    .then(number => {
      console.log(number);
    })
    .catch(err => {
      console.error(err);
    })
  }
//modern way to consume promises
  async jsPromisesTwo() {
    try{
      const n = await this.quizSvc.getMagicNumber(true);
      const n2 = await this.quizSvc.getMagicNumber(false);
    }
    catch(err){
      console.error(err);
    }
  }

  async jsPromisesThree (){
    const n = this.quizSvc.getMagicNumber(true);
    const n2 = this.quizSvc.getMagicNumber(true);
    console.log(n, n2);
    try {
      const foo = await Promise.race([n, n2]);//whichever comes back first is the winner
      console.log(foo);
    }
    catch(err) {
      console.error(err);
    }
  }
  cancelAllChanges() {
    this.loadQuizzesForDisplay();
    this.selectedQuiz = undefined;
  }
  //read only property to find the length of the below array
  get deletedQuizCount(){
    return this.getDeletedQuizzes().length;
  }
  //function, returns a quiz display array that are marked for delete
  getDeletedQuizzes(){
    return this.quizzes.filter(x => x.markedForDelete);
  }



}
