import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
    constructor(props) {
        super(props);
        this.state = { albums: albumData };
    }

    render() {
        return (
            <section className='library'>
                {
                    this.state.albums.map( (album, index) =>
                        <Link className="albumLink" to={`/album/${album.slug}`} key={index}>
                            <img className="libraryAlbumImg" src={album.albumCover} alt={album.title} />
                            <div className="albumTitleLink">{album.title}</div>
                            <div>{album.artist}</div>
                            <div className="songsNumber">{album.songs.length} songs</div>
                        </Link>
                    )
                }
            </section>
        );
    }
}

export default Library;