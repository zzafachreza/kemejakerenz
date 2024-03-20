import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MyPicker, MyGap, MyInput, MyButton } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { Image } from 'react-native';
import { getData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import { Rating, AirbnbRating } from 'react-native-ratings';

export default function ({ navigation, route }) {

    const item = route.params.barang;
    console.log(route.params.barang)

    const [data, setData] = useState([]);
    const [rating, setRating] = useState(1);
    const [kirim, setKirim] = useState({
        fid_barang: route.params.barang.id,
        fid_user: route.params.fid_user,
    });

    const [loading, setLoading] = useState(false);
    const __sendServer = () => {
        console.log({
            fid_barang: route.params.barang.fid_barang,
            fid_user: route.params.fid_user,
            nilai: rating
        });
        setLoading(true);

        setTimeout(() => {
            axios.post(urlAPI + '/rating.php', {
                fid_barang: route.params.barang.fid_barang,
                fid_user: route.params.fid_user,
                nilai: rating
            }).then(res => {
                console.log(res.data);

                showMessage({
                    type: 'success',
                    message: 'Rating berhasil di kirim !'
                });
                navigation.goBack()
            }).finally(() => {
                setLoading(false);
            })
        }, 1200)
    }

    useEffect(() => {

    }, [])

    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors.white,
        }}>
            <View style={{
                flex: 1,
                padding: 20,
            }}>
                <Image style={{
                    width: '100%',
                    height: 300,
                    resizeMode: 'contain'
                }} source={{
                    uri: item.image
                }} />
                <Text
                    style={{
                        marginTop: 10,
                        fontFamily: fonts.secondary[600],
                        fontSize: windowWidth / 20,
                        color: colors.black,
                    }}>{item.nama_barang}</Text>

            </View>

            <View style={{
                padding: 20,
            }}>
                <Rating
                    showRating
                    // jumpValue={1}
                    minValue={1}
                    ratingCount={5}
                    startingValue={rating}
                    ratingTextColor={colors.primary}
                    onFinishRating={x => {
                        setRating(x)
                    }}
                    style={{ paddingVertical: 10 }}
                />

                <MyGap jarak={10} />
                {!loading && <MyButton onPress={__sendServer} title="Rating Barng ini" Icons="cloud-upload-outline" warna={colors.primary} />}
                {loading && <ActivityIndicator color={colors.secondary} size="large" />}
            </View>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({})