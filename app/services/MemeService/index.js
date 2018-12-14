import axios from 'axios'

class MemeService {

  startNewPublicGame() {

    /*

    This needs to check for open public socket rooms with other players

    */


    axios.post('/urlgenerator').then((response) => {
      let unique_session_id = response.data.unique_session_id
      window.location.href = 'http://localhost:3000/' + 'game/' + unique_session_id.toString()
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  startNewPrivateGame() {

    //pretty much done
    axios.post('/urlgenerator').then((response) => {
      let unique_session_id = response.data.unique_session_id
      window.location.href = 'http://localhost:3000/' + 'game/' + unique_session_id.toString()
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getMemes(meme_id) {

    let meme_site_username = 'username=nickwhite1423'
    let meme_site_password = 'password=memesrgreat1'

    // what we need
    let meme_template_id = "template_id=" + meme_id.toString()
    let caption_text = "text0=" + this.state.meme_caption

    let caption_image_url = "https://api.imgflip.com/caption_image?" + meme_template_id + '&' + meme_site_username + '&' + meme_site_password + '&' + caption_text

    axios.get(caption_image_url)
      .then((response) => {

        console.log("response.data", response.data.data)
        this.setState({ captioned_img_url : response.data.data.url })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  enteredName() {
    //pretty much done

    /*
    axios.post('/urlgenerator').then((response) => {
      let unique_session_id = response.data.unique_session_id
      window.location.href = 'http://localhost:3000/' + 'game/' + unique_session_id.toString()
    })
    .catch(function (error) {
      console.log(error);
    });
    */
  }
}

export default MemeService;
