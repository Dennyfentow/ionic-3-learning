import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MoovieProvider } from '../../providers/moovie/moovie';
import { FilmeDetalhesPage } from '../filme-detalhes/filme-detalhes';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers: [
    MoovieProvider
  ]
})
export class FeedPage {
  public objeto_feed = {
    titulo: "Charles Franca",
    data: "November 5, 1955",
    descricao: "Estou criando um App incrivel... TESTE",
    qntd_likes: 12,
    qntd_comments: 4,
    time_comment: "11h ago"
  }
  private loader;
  private refresher;
  private isRefreshing = false;
  public nome_usuario: string = "Charles França do Código";
  public lista_filmes= new Array<any>();
  public page = 1;
  public infiniteScroll;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private movieProvider: MoovieProvider,
    public loadingCtrl: LoadingController) {
  }

  abrirCarregando() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando Filmes..."
    });
    this.loader.present();
  }

  fecharCarregando(){
    this.loader.dismiss();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;

    this.carregarFilmes();
  }

  ionViewDidEnter() {
    this.abrirCarregando();
    this.carregarFilmes();
  }

  abrirDetalhes(filme){
    this.navCtrl.push(FilmeDetalhesPage, {id: filme.id});
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.infiniteScroll = infiniteScroll;
    this.carregarFilmes(true);


  }

  carregarFilmes(newPage: boolean = false){
    this.movieProvider.getPopularMovies(this.page).subscribe(
      data => {
        const response = (data as any);
        if(newPage){
          this.lista_filmes = this.lista_filmes.concat(response.results);
          this.infiniteScroll.complete();
        } else{
          this.lista_filmes = response.results;
        }
        
        this.fecharCarregando();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing = false;
        }
      },
      error => {
        console.log(error);
        this.fecharCarregando();
        if(this.isRefreshing){
          this.refresher.complete();
          this.isRefreshing = false;
        }
      }
    )
  }


}
