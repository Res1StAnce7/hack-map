import React, {useEffect} from 'react'
import { useRef } from 'react'
import {GoogleMap, useJsApiLoader, Autocomplete,
    DirectionsRenderer, Marker, HeatmapLayer} from '@react-google-maps/api';
import {Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, Text,
    Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalContent, Textarea,
} from '@chakra-ui/react'
import {FaLocationArrow, FaMap, FaTimes} from 'react-icons/fa'
import {RiAlarmWarningFill} from 'react-icons/ri'

const containerStyle = {
    width: '100%',
    height: '100%'
};

let heatMapData = [];
let data = false;

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        language: 'en',
        region: 'US',
        googleMapsApiKey: "AIzaSyCbibYU79CUknzovDk7S1ZGoBF9oCeEx9Y",
        libraries:['places', 'directions', 'geometry', 'visualization']
    })
    const [showWindowMain, setShowWindowMain] = React.useState(false)
    const [showWindowSub1, setShowWindowSub1] = React.useState(false)
    const [showWindowSub2, setShowWindowSub2] = React.useState(false)
    const [showWindowSub3, setShowWindowSub3] = React.useState(false)
    const [center, setCenter] = React.useState({lat: 40.756219, lng: -73.98641})
    const [map, setMap] = React.useState(null)
    const [distance, setDistance] = React.useState('--')
    const [duration, setDuration] = React.useState('--')
    const [directionsResponse, setDirectionsResponse] = React.useState(null)
    const [showHeatmap, setShowHeatmap] = React.useState(false);
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destinationRef = useRef()
    const heatmapRef = useRef();


    async function calculateRoute() {
        if (destinationRef.current.value === '') {
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: originRef.current.value === '' ? center : originRef.current.value,
            destination: destinationRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.WALKING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text.replace('mi', 'miles'))
        setDuration(results.routes[0].legs[0].duration.text)
    }

    function clearRoute() {
        setDistance('')
        setDuration('')
        setDirectionsResponse(null)
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    function makeAndSetData() {
        if (!data) {
            let file = require('./data.json');
            file.forEach((item) => {
                heatMapData.push({
                    // eslint-disable-next-line no-undef
                    location: new google.maps.LatLng(item.lat, item.lng),
                    weight: Math.random() * 1000,
                });
            });
            data = true;
        }
        return heatMapData;
    }

    function setCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        })
        map.panTo(center)
    }

    return isLoaded ? (
        <Flex position='relative' flexDirection='column' alignItems='center' h='100vh' w='100vw'>
            <Box position={'absolute'} left={0} top={0} h={'100%'} w={'100%'}>
                <GoogleMap mapContainerStyle={containerStyle} center={center}
                    zoom={17} onLoad={map => setMap(map)}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false
                    }}>
                    {showHeatmap && <HeatmapLayer data={makeAndSetData()} ref={heatmapRef}/>}
                    {center.lat !== null && center.lng !== null && (
                        <Marker position={center}
                            icon={{
                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            }}
                        />
                    )}
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                </GoogleMap>
            </Box>
            <Box p={5} borderRadius={"2xl"} m={5} bgColor='#FBFBF5' shadow='1px 2px 9px #ADD8E6'
                minW='container.md' zIndex='1' position={'absolute'} top={'0px'} left={'0px'}>
                <HStack spacing={2} justifyContent='space-between'>
                    <Box flexGrow={1} shadow={'sm'}>
                        <Autocomplete>
                            <Input type='text' placeholder='Current Location' ref={originRef} />
                        </Autocomplete>
                    </Box>
                    <Box flexGrow={1} shadow={'sm'} >
                        <Autocomplete>
                            <Input type='text' placeholder='Destination' ref={destinationRef} />
                        </Autocomplete>
                    </Box>
                    <ButtonGroup>
                        <Button colorScheme='blue' type='submit' onClick={calculateRoute}>
                            Calculate Route
                        </Button>
                        <IconButton
                            aria-label='center back'
                            icon={<FaTimes />}
                            onClick={clearRoute}
                        />
                    </ButtonGroup>
                </HStack>
                <HStack spacing={4} mt={4} justifyContent='space-between'>
                    <Text>Distance: {distance} </Text>
                    <Text>Duration: {duration} </Text>
                    <ButtonGroup>
                        <IconButton
                            aria-label='center back'
                            icon={<RiAlarmWarningFill />}
                            onClick={() => setShowWindowMain(!showWindowMain)}
                        >
                        </IconButton>
                        <IconButton
                            aria-label='center back'
                            icon={<FaLocationArrow />}
                            isRound
                            onClick={() => setCurrentLocation()}
                        />
                        <IconButton
                            aria-label={'center back'}
                            icon={<FaMap />}
                            isRound
                            onClick={() => setShowHeatmap(!showHeatmap)}/>
                    </ButtonGroup>
                </HStack>
            </Box>
            {showWindowMain && (
                <Modal isOpen={showWindowMain} onClose={() => setShowWindowMain(false)}>
                    <ModalOverlay />
                    <ModalContent style={{textAlign: "center", width: "500px", height: "500px"}}>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody style={{display: "flex", flexDirection: "column"}}>
                            <Button variant="ghost" color="primary" style={{height: "90px"}}
                                    onClick={() => setShowWindowSub1(!showWindowSub1)}>
                                1
                            </Button>
                            <Button variant="ghost" style={{marginTop: "50px", height: "90px"}}
                                    onClick={() => setShowWindowSub2(!showWindowSub2)}>
                                2
                            </Button>
                            <Button variant="ghost" style={{marginTop: "50px", height: "90px"}}
                                onClick={() => setShowWindowSub3(!showWindowSub3)}>
                                3
                            </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            {showWindowSub1 && (<Modal isOpen={showWindowSub1} onClose={() => setShowWindowSub1(false)}>
                <ModalOverlay />
                <ModalContent style={{textAlign: "center", width: "500px", height: "500px"}}>
                    <ModalCloseButton />
                    <ModalHeader>Report</ModalHeader>
                    <ModalBody style={{display: "flex", flexDirection: "column"}}>
                        <Input placeholder="Title" />
                        <Textarea placeholder="Description" style={{marginTop: "20px", height: "320px"}}/>
                    </ModalBody>
                </ModalContent>
            </Modal>)}
            {showWindowSub2 && (<Modal isOpen={showWindowSub2} onClose={() => setShowWindowSub2(false)}>
                <ModalOverlay />
                <ModalContent style={{textAlign: "center", width: "500px", height: "500px"}}>
                    <ModalCloseButton />
                    <ModalHeader>Notify</ModalHeader>
                    <ModalBody style={{display: "flex", flexDirection: "column"}}>
                        <Input placeholder="Title" />
                        <Textarea placeholder="Description" style={{marginTop: "20px", height: "320px"}}/>
                    </ModalBody>
                </ModalContent>
            </Modal>)}
            {showWindowSub3 && (<Modal isOpen={showWindowSub3} onClose={() => setShowWindowSub3(false)}>
                <ModalOverlay />
                <ModalContent style={{textAlign: "center", width: "500px", height: "500px"}}>
                    <ModalCloseButton />
                    <ModalHeader>Call 911</ModalHeader>
                    <ModalBody style={{display: "flex", flexDirection: "column"}}>
                        <Text style={{marginTop:"150px"}}>Police is on the way</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>)}
        </Flex>
    ) : <></>
}

export default React.memo(MyComponent)

//APIKey: AIzaSyCbibYU79CUknzovDk7S1ZGoBF9oCeEx9Y