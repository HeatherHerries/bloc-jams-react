import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
    constructor(props) {
        super(props);

        const album = albumData.find( album => {
            return album.slug === this.props.match.params.slug;
        });

        this.state = {
            album: album,
            currentSong: album.songs[0],
            currentTime: 0,
            duration: album.songs[0].duration,
            volume: 0,
            isPlaying: false,
            isHovered: false
        };

        this.audioElement = document.createElement('audio');
        this.audioElement.src = album.songs[0].audioSrc;
    }

    componentDidMount() {
       this.eventListeners = {
           timeupdate: e => {
               this.setState({ currentTime: this.audioElement.currentTime });
           },
           durationchange: e => {
               this.setState({ duration: this.audioElement.duration });
           },
           volumechange: e => {
               this.setState({ volume: this.audioElement.volume });
           }
       };

       this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
       this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
       this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
    }

    componentWillUnmount() {
        this.audioElement.src = null;
        this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
        this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
    }

    play() {
        this.audioElement.play();
        this.setState({ isPlaying: true });
    }

    pause() {
        this.audioElement.pause();
        this.setState({ isPlaying: false });
    }

    setSong(song) {
        this.audioElement.src = song.audioSrc;
        this.setState({ currentSong: song });
    }

    handleSongClick(song) {
        const isSameSong = this.state.currentSong === song;
        if (this.state.isPlaying && isSameSong) {
            this.pause();
        } else {
            if (!isSameSong) { this.setSong(song); }
            this.play();
        }
    }

    handlePrevClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const newIndex = Math.max(0, currentIndex - 1);
        const newSong = this.state.album.songs[newIndex];
        this.setSong(newSong);
        this.play();
    }

    handleNextClick() {
        const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
        const nextIndex = Math.min(this.state.album.songs.length, currentIndex + 1);
        const newSong = this.state.album.songs[nextIndex];
        if (!this.state.isPlaying) {
            return null;
        }
        if (!newSong) {
            return null;
        }
        this.setSong(newSong);
        this.play();
    }

    onHover(index) {
        this.setState({ isHovered: index });
    }

    offHover() {
        this.setState({ isHovered: false });
    }

    hoverIcon(song, index) {
        if (this.state.currentSong === song && this.state.isPlaying) {
            return <span className="icon ion-md-pause" />;
        } else if (this.state.isHovered === index) {
            return <span className="icon ion-md-play" />;
        } else {
            return <span className="song-number">{index + 1}</span>;
        }
    }

    handleTimeChange(e) {
        const newTime = this.audioElement.duration * e.target.value;
        this.audioElement.currentTime = newTime;
        this.setState({ currentTime: newTime });
    }

    formatTime(timeInSeconds) {
        if (timeInSeconds < 10) {
            return (Math.floor(timeInSeconds / 60)) + ":0" + (Math.floor(timeInSeconds % 60))
        } else if (timeInSeconds) {
            return(Math.floor(timeInSeconds / 60 )) + ":" +(Math.floor(timeInSeconds % 60))
        } else {
            return "-:--";
        }
    }

    handleVolumeChange(e) {
        const newVolume = e.target.value;
        this.audioElement.volume = newVolume;
        this.setState({ currentVolume: newVolume });
    }

    render() {
        return (
            <section className="album">
                <section className="albumInfo" id="album-info">
                    <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
                    <div className="album-details">
                        <h1 id="album-title">{this.state.album.title}</h1>
                        <h2 className="artist">{this.state.album.artist}</h2>
                        <div id="release-info">{this.state.album.year} {this.state.album.label}</div>
                    </div>
                </section>
                <table className="songList" id="song-list">
                    <colgroup>
                        <col id="song-number-column" />
                        <col id="song-title-column" />
                        <col id="song-duration-column" />
                    </colgroup>
                    <tbody>
                        {this.state.album.songs.map( (song, index) =>
                            <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.onHover(index)} onMouseLeave={() => this.offHover()}>
                                <td className="song-number">{this.hoverIcon(song, index)}</td>
                                <td className="song-title">{song.title}</td>
                                <td className="song-duration">{song.duration}</td>

                            </tr>)}
                    </tbody>
                </table>
                <PlayerBar 
                    isPlaying={this.state.isPlaying}
                    currentSong={this.state.currentSong}
                    currentTime={this.audioElement.currentTime}
                    duration={this.audioElement.duration}
                    volume={this.audioElement.volume}
                    handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                    handlePrevClick={() => this.handlePrevClick()}
                    handleNextClick={() => this.handleNextClick()}
                    handleTimeChange={(e) => this.handleTimeChange(e)}
                    handleVolumeChange={(e) => this.handleVolumeChange(e)}
                    formatTime={(e) => this.formatTime(e)}
                />
            </section>
        );
    }
}


export default Album;