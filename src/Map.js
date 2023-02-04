import React, {useEffect} from 'react'
import { useRef } from 'react'
import {GoogleMap, useJsApiLoader, Autocomplete,
    DirectionsRenderer, Marker, HeatmapLayer, InfoWindow} from '@react-google-maps/api';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    Text,
    Modal, CloseButton, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalContent, ModalFooter,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes} from 'react-icons/fa'
import {RiAlarmWarningFill} from 'react-icons/ri'

const containerStyle = {
    width: '100%',
    height: '100%'
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        language: 'en',
        region: 'US',
        googleMapsApiKey: "AIzaSyCbibYU79CUknzovDk7S1ZGoBF9oCeEx9Y",
        libraries:['places', 'directions', 'geometry', 'visualization']
    })
    const [showWindow, setShowWindow] = React.useState(false)
    const [center, setCenter] = React.useState({ lat: null, lng: null })
    const [map, setMap] = React.useState(null)
    const [distance, setDistance] = React.useState('--')
    const [duration, setDuration] = React.useState('--')
    const [directionsResponse, setDirectionsResponse] = React.useState(null)
    const [data, setData] = React.useState(null)
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()
    const heatmapRef = useRef();


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    async function calculateRoute() {
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destiantionRef.current.value,
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
        destiantionRef.current.value = ''
    }

    return isLoaded ? (
        <Flex
            position='relative'
            flexDirection='column'
            alignItems='center'
            h='100vh'
            w='100vw'
        >
            <Box position={'absolute'} left={0} top={0} h={'100%'} w={'100%'}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={17}
                    // onLoad={onLoad}
                    onLoad={map => setMap(map)}
                >

                    {/*<HeatmapLayer data={heatMapData} />*/}
                    {center.lat !== null && center.lng !== null && (
                        <Marker
                            position={center}
                            icon={{
                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            }}
                        />
                    )}
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                    { /* Child components, such as markers, info windows, etc. */ }
                    <></>
                </GoogleMap>
            </Box>
            <Box
                p={5}
                borderRadius={"2xl"}
                m={5}
                bgColor='#FBFBF5'
                shadow='1px 2px 9px #ADD8E6'
                minW='container.md'
                zIndex='1'
                position={'absolute'}
                top={'3%'}
                left={'0px'}
            >
                <HStack spacing={2} justifyContent='space-between'>
                    <Box flexGrow={1} shadow={'sm'}>
                        <Autocomplete>
                            <Input type='text' placeholder='Starting Point' ref={originRef} />
                        </Autocomplete>
                    </Box>
                    <Box flexGrow={1} shadow={'sm'} >
                        <Autocomplete>
                            <Input type='text' placeholder='Destination' ref={destiantionRef} />
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

                    <IconButton
                        aria-label='center back'
                        icon={<RiAlarmWarningFill />}
                        onClick={() => setShowWindow(!showWindow)}
                    >
                        Show/Hide Window
                    </IconButton>
                    <IconButton
                        aria-label='center back'
                        icon={<FaLocationArrow />}
                        isRound
                        onClick={() => {
                            map.panTo(center)
                            map.setZoom(17)
                        }}
                    />
                </HStack>
            </Box>
            {showWindow && (
                <Modal isOpen={showWindow} onClose={() => setShowWindow(false)}>
                    <ModalOverlay />
                    <ModalContent style={{textAlign: "center"}}>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody style={{display: "flex", flexDirection: "column"}}>
                            <Button variant="ghost">1</Button>
                            <Button variant="ghost">2</Button>
                            <Button variant="ghost">3</Button>
                            <Button variant="ghost">4</Button>
                        </ModalBody>

                        <ModalFooter>
                            {/*<Button colorScheme="blue" mr={3} onClick={() => setShowWindow(!showWindow)}>*/}
                            {/*    Close*/}
                            {/*</Button>*/}
                            {/*<Button variant="ghost">Secondary Action</Button>*/}
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Flex>
    ) : <></>
}

export default React.memo(MyComponent)


//AIzaSyCbibYU79CUknzovDk7S1ZGoBF9oCeEx9Y