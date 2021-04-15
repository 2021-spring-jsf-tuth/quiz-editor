import { 
  Component
  , OnInit 
} from '@angular/core';

import { QuizService } from './quiz.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private quizSvc: QuizService
  ) {}

  quizzes = [];
  errorLoadingQuizzes = false;
  
  ngOnInit() {
    this.quizSvc
      .loadQuizzes()
      .subscribe(
        
        // Lamda with the data
        (data) => {
          console.log(data);
          this.quizzes = data;
        }

        // Lamda with the errors, if errors exist
        , (err) => {
          console.error(err);
        this.errorLoadingQuizzes = true;
      }

      )
    ;

    console.log(this.quizzes);
  }

  title = 'quiz-editor';

  selectedQuiz = undefined;

  selectQuiz(q) {
    this.selectedQuiz = q;
  }

  addNewQuiz() {

    const newQuiz = {
      name: "Untitled Quiz"
      , questions: []
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
}
