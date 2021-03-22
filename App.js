import React, { useRef } from "react"
import {View, Text, FlatList, Dimensions, StyleSheet, LogBox, Animated, TouchableOpacity} from "react-native"

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

LogBox.ignoreAllLogs(true)

const Indicator = ({scrollX}) => {
  return(
    <View style={{
      position : "absolute",
      bottom : 0.16*screenHeight,
      flexDirection : "row",
      height : 0.026*screenWidth
    }} >
      {
        data.map((_, i) => {

          const inputRange = [(i-1) * screenWidth, i * screenWidth, (i+1) * screenWidth]

          const dotWidth = scrollX.interpolate({
            inputRange : inputRange,
            outputRange : [0.025*screenWidth, 0.05*screenWidth, 0.025*screenWidth],
            extrapolate : 'clamp'
          })

          const opacity = scrollX.interpolate({
            inputRange : inputRange,
            outputRange : [0.4, 1, 0.4],
            extrapolate : 'clamp'
          })


          return(
              <Animated.View
              key={`indicater-${i}`}
              style={{
                height : 0.025*screenWidth,
                width : dotWidth,
                borderRadius : screenWidth,
                backgroundColor : "#000",
                marginHorizontal : 0.03*screenWidth,
                opacity: opacity,
              }}
            />
          )
        })
      }
    </View>
  )
}

const NextButton = ({scrollTo}) => {
  return(
    <View style={{width : screenWidth , alignItems : "center", justifyContent : "center"}} >
        <TouchableOpacity onPress={scrollTo} style={styles.Button} >

        </TouchableOpacity>
    </View>
  )
}

function App() {

    const scrollX = React.useRef(new Animated.Value(0)).current

    const [slide, setSlide] = React.useState(0)

    const [currentIndex, setCurrentIndex] = React.useState(0)
    const slidesRef = useRef(null)

    const scrollTo = () => {
        if(currentIndex < data.length - 1){
            slidesRef.current.scrollToIndex({index : currentIndex + 1})
            console.log(currentIndex)
        } else {
          alert("Last Item")
        }
    }

    const viewConfig = React.useRef({waitForInteraction: true,viewAreaCoveragePercentThreshold : 100}).current

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index)
    }).current


  return(
    <View style={styles.Root} >
    <Animated.FlatList
      horizontal
      scrollEventThrottle={32}
      data={data}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      keyExtractor={(item) => item.id}
      onScroll={
        Animated.event(
          [{
            nativeEvent : {contentOffset : {x : scrollX}}
          }],
          {useNativeDriver : false}
        )
      }
      ref={slidesRef}
      pagingEnabled
      viewabilityConfig={viewConfig}
      onViewableItemsChanged={viewableItemsChanged}
      renderItem={({item, index}) => {

        const s = screenWidth*0.95
        const spacing = 12
        const fullSize = s + spacing * 2

          const inputRange = [
            (index-0.5) * fullSize,
            index * fullSize,
            (index + 0.5) * fullSize
          ]

          const scrollTextX = scrollX.interpolate({
            inputRange : inputRange,
            outputRange : [s , 0, -s]
          })
        return(
          <View style={{width : screenWidth, alignItems : "center", justifyContent : "center", height : 0.85*screenHeight}} >
            <View style={styles.Image} >
            </View>
          <Animated.View style={{
            alignItems : "center",
            transform : [
              {
                translateX : scrollTextX
              }
            ]
          }} >
          <Text style={[styles.Title]}>{item.title}</Text>
            <Text style={styles.Des} >{item.des1}</Text>
            <Text style={styles.Description} >{item.description}</Text>
          </Animated.View>
          <View style={{
      height : 0.25*screenHeight,
      width : screenWidth,
      backgroundColor : "#fff",
      position : "absolute",
      top : 0.32*screenHeight,
    }} ></View>

        </View>
        )
      }}
    />
    <View style={{
      height : 0.25*screenHeight,
      width : screenWidth,
      backgroundColor : "#fff"
    }} ></View>
    <Indicator scrollX={scrollX} />

    <NextButton scrollTo={scrollTo} />
   
</View>
  )
}

export default App

const data = [
  {
    id : 1,
    title : "Best Teachers",
    des1 : "In India",
    description : "Engaging videos that make learing \n simple and fun"
  },
  {
    id : 2,
    title : "Personalised",
    des1 : "Learning",
    description : "Unique learning journeys \n created just for you"
  },
  {
    id : 3,
    title : "Detailed",
    des1 : "Insights",
    description : "Customized feedback with \n recommendations at every step"
  }
]

const styles = StyleSheet.create({
  Root : {
    flex : 1,
    backgroundColor : "#ffffff",
    alignItems : "center",
    justifyContent : "center"
  },
  Image : {
    height :0.9*screenWidth,
    width : 0.9*screenWidth,
    backgroundColor : "red",
    zIndex : 100,
    borderRadius : 0.04*screenWidth
  },
  Title : {
    fontSize : 0.068*screenWidth,
    marginTop : 0.1*screenHeight,
    fontWeight : "bold",
    color  :"#424242"
  },
  Des : {
    fontSize : 0.035*screenWidth,
    fontWeight : "bold",
    marginTop : 0.01*screenHeight,
    color : "#a1a1a1"
  },
  Description : {
    fontSize : 0.045*screenWidth,
    fontWeight : "bold",
    marginTop : 0.035*screenHeight,
    color : "#a1a1a1",
    textAlign : "center"
  },
  Button : {
    height : 0.075*screenHeight,
    width: 0.85*screenWidth,
    backgroundColor : "red",
    position : "absolute",
    bottom : 0.04*screenHeight,
    borderRadius : 0.025*screenWidth,
    alignItems : "center",
    justifyContent : "center"
  }
})