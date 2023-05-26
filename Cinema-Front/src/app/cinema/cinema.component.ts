import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit{

  public villes:any;
  public cinemas:any;
  public currentVille: any;
  public currentCinema:any;
  public currentProjection:any;
  public salles: any;
  public selectedTickets:any;
  constructor(public cinemaService:CinemaService) {}
  ngOnInit() {
    this.changerVilles();
  }

  private changerVilles(){
    this.cinemaService.getVilles().subscribe(data =>{
      this.villes=data;
    },err=>{
      console.log(err);
    })
  }

  onGetCinemas(v: any) {
    this.currentVille=v;
    this.currentCinema = undefined;
    this.salles = undefined
    this.currentProjection = undefined;
    this.cinemaService.getCinemas(v).subscribe(data =>{
      this.cinemas=data;
    },err=>{
      console.log(err);
    })
  }

  onGetSalles(c: any) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data =>{
        this.salles = data;
        this.salles._embedded.salles.forEach(
            (salle)=>{
            this.cinemaService.getProjection(salle)
              .subscribe(data =>{
                salle.projection = data;
              },err=> {
                console.log(err);
              })

          }
        )
      },err=> {
        console.log(err);
      })

  }

  onGetTicketPlace(p: any) {
    this.currentProjection = p;
    this.cinemaService.getPlace(p)
      .subscribe(data =>{
      this.currentProjection.tickets = data;
      this.selectedTickets = [];
    },err=>{
      console.log(err);
    })
  }

  onSelectTicket(t: any) {
    if(!t.selected){
      t.selected = true;
      this.selectedTickets.push(t);
    }
    else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }


  }

  getTicketClass(t: any) {
    let str = "btn ";
    if(t.reserve==true){
      str+= "btn-danger";
    }
    else if(t.selected){
      str+="btn-warning"
    }
    else {
      str+="btn-success"
    }
    return str+" ticket";
  }

  onPayTickets(dataForm:any) {
    let tickets: any[] = [];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data=>{
        alert("Tickets Réservés avec succès!");
        this.onGetTicketPlace(this.currentProjection);
      },err=>{
        console.log(err);
      })
  }
}
