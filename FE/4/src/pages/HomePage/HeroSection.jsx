import {React, useState} from 'react';
import SearchBar from './SearchBar';
import MapResult from './MapResult';

export default function HeroSection() {
    const [motels, setMotels] = useState([]);

    return (
        <div className="homepage-image-wrapper">
            <img src="HomepageImage.jpg" alt="Couple on couch" className="homepage-image" />
            <div className="overlay-box">
                <h1 className="overlay-title">Find your perfect rental</h1>
                <p className="overlay-description">
                    Browse trusted accommodations with ease – apartments, homes, and more, all in one place.
                </p>
            </div>
            <SearchBar onSearch={setMotels} />
            {motels.length > 0 && (
                <div className="mt-4">
                    <MapResult motels={motels} />
                </div>
            )}
        </div>
    );
}
