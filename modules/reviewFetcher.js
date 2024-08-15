export class ReviewNote {
    constructor(url) {
        this.url = url;
    }

    async fetchNotes() {
        return await fetch(this.url, {
          method: 'GET'
        }).then(response => response.json())
            .then(data => {
              if (data) {
                const reviewsArray = Object.keys(data).map(key => {
                  return data[key];
                });
                return reviewsArray;
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
      }

    async submitNote({ name, text, rating }) {
        console.log({ name, text, rating });
        return await fetch(this.url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            id: Math.floor(Math.random() * 1e10).toString().padStart(10, '0'),
            name: name,
            text: text,
            rating: rating,
          })
        });
      }
}