import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyButton, MyInput, MyPicker } from '../../components';
import { colors } from '../../utils/colors';
import { TouchableOpacity, Swipeable } from 'react-native-gesture-handler';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { showMessage } from 'react-native-flash-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Modalize } from 'react-native-modalize';

export default function Cart({ navigation, route }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [buka, setbuka] = useState(true);
  const [tipe, setTipe] = useState(false);
  const [jenis, setJenis] = useState('DI ANTAR KE BANK SAMPAH');
  const [alamat, setAlamat] = useState('');
  const [loading, setLoading] = useState(false);
  const [jumlah, setJumlah] = useState(1);
  const [itemz, setItem] = useState({});

  const modalizeRef = useRef();

  const updateCart = () => {
    console.log(itemz);

    axios.post(urlAPI + '/cart_update.php', {
      id_cart: itemz.id,
      qty: itemz.qty,
      total: itemz.total
    }).then(x => {
      modalizeRef.current.close();
      getData('user').then(tkn => {
        __getDataBarang(tkn.id);
      });
      getData('cart').then(xx => {
        storeData('cart', xx - 1)
      });
    })

  }

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const isFocused = useIsFocused();
  //   useEffect(() => {

  //   }, []);

  useEffect(() => {
    if (isFocused) {

      getData('user').then(rx => {
        console.log(rx)
        setUser(rx);
        __getDataBarang(rx.id);
      });

    }
  }, [isFocused]);

  const __getDataBarang = (zz) => {
    axios.post(urlAPI + '/cart.php', {
      fid_user: zz
    }).then(x => {
      setData(x.data);
    })

  }

  const hanldeHapus = (x) => {
    axios.post(urlAPI + '/cart_hapus.php', {
      id_cart: x
    }).then(x => {
      getData('user').then(tkn => {
        __getDataBarang(tkn.id);
      });
      getData('cart').then(xx => {
        storeData('cart', xx - 1)
      });
    })
  };




  var sub = 0;
  var beratTotal = 0;
  data.map((item, key) => {
    sub += parseFloat(item.total);
    beratTotal += parseFloat(item.berat);
  });

  const __renderItem = ({ item, index }) => {
    return (

      <View style={{
        backgroundColor: colors.white,
        marginVertical: 3,
      }}>
        <View
          style={{

            padding: 10,
            flexDirection: 'row'
          }}>
          <View style={{
            paddingHorizontal: 10,
          }}>
            <Image style={{
              width: 50, height: 50,
              borderRadius: 5,
            }} source={{
              uri: item.image
            }} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center' }}>

            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 30,
              }}>
              {item.nama_barang}
            </Text>

            <Text
              style={{
                fontFamily: fonts.secondary[400],
                flex: 1,
                fontSize: windowWidth / 30,
              }}>
              {new Intl.NumberFormat().format(item.harga)} x {item.qty}
            </Text>
          </View>

          <View
            style={{
              // justifyContent: 'flex-end',
              // alignItems: 'flex-end',
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                color: colors.black,
                fontSize: windowWidth / 20,
              }}>
              {new Intl.NumberFormat().format(item.total)}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}>

          <TouchableOpacity
            onPress={() => {
              setItem(item);
              modalizeRef.current.open();
            }}
            style={{
              marginHorizontal: 5,
            }}>
            <Icon type='ionicon' name='create' color={colors.primary} />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => {


            Alert.alert(
              "Apakah kamu yakin akan menghapus ini ?",
              item.nama_barang,
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => hanldeHapus(item.id) }
              ]
            );

          }} style={{
            marginHorizontal: 5,
          }}>
            <Icon type='ionicon' name='trash' color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View >

    );
  };


  const [foto, setfoto] = useState('https://zavalabs.com/nogambar.jpg');

  const options = {
    includeBase64: true,
    quality: 0.3,
  };

  const getCamera = xyz => {
    launchCamera(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let source = { uri: response.uri };
        switch (xyz) {
          case 1:
            setfoto(`data:${response.type};base64, ${response.base64}`)
            break;
        }
      }
    });
  };

  const getGallery = xyz => {
    launchImageLibrary(options, response => {
      console.log('All Response = ', response);

      console.log('Ukuran = ', response.fileSize);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        if (response.fileSize <= 200000) {
          let source = { uri: response.uri };
          switch (xyz) {
            case 1:
              setfoto(`data:${response.type};base64, ${response.base64}`)
              break;
          }
        } else {
          showMessage({
            message: 'Ukuran Foto Terlalu Besar Max 500 KB',
            type: 'danger',
          });
        }
      }
    });
  };



  return (
    <SafeAreaView
      style={{
        flex: 1,
        // padding: 10,
      }}>

      <FlatList data={data} renderItem={__renderItem} />


      <Modalize
        withHandle={false}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        snapPoint={windowHeight / 3.4}
        HeaderComponent={
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[400],
                    fontSize: windowWidth / 35,
                    color: colors.black,
                  }}>
                  {itemz.nama_barang}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 20,
                    color: colors.black,
                  }}>
                  Rp. {new Intl.NumberFormat().format(itemz.harga * itemz.qty)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => modalizeRef.current.close()}>
                <Icon type="ionicon" name="close-outline" size={35} />
              </TouchableOpacity>
            </View>
          </View>
        }

        ref={modalizeRef}>
        <View style={{ flex: 1, height: windowWidth / 3 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, padding: 10, }}>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    color: colors.black,
                  }}>
                  Jumlah
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-end'
                }}>
                <TouchableOpacity
                  onPress={() => {
                    itemz.qty == 1
                      ? showMessage({
                        type: 'danger',
                        message: 'Minimal pembelian 1',
                      })
                      : setItem({
                        ...itemz,
                        qty: itemz.qty - 1,
                        total: itemz.harga * (itemz.qty - 1)
                      });
                  }}
                  style={{
                    backgroundColor: colors.primary,
                    width: 80,
                    borderRadius: 10,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Icon type="ionicon" name="remove" color={colors.white} />
                </TouchableOpacity>
                <View
                  style={{
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{ fontSize: 16, fontFamily: fonts.secondary[600] }}>
                    {itemz.qty}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setItem({
                      ...itemz,
                      qty: parseInt(itemz.qty) + 1,
                      total: itemz.harga * (parseInt(itemz.qty) + 1)
                    });
                  }}
                  style={{
                    backgroundColor: colors.primary,
                    width: 80,
                    borderRadius: 10,
                    marginLeft: 10,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon type="ionicon" name="add" color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>


            <View style={{ marginTop: 10, paddingHorizontal: 10, }}>
              <TouchableOpacity
                onPress={updateCart}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: 10,
                  padding: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}>
                <Icon type='ionicon' name='create-outline' color={colors.white} />
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 22,
                    color: colors.white,
                  }}>
                  SIMPAN
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modalize>
      {!loading &&
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: windowWidth / 20,
                fontFamily: fonts.secondary[600],
                color: colors.black,
                left: 10,
              }}>
              Rp. {new Intl.NumberFormat().format(sub)}

            </Text>
            <Text
              style={{
                fontSize: windowWidth / 20,
                fontFamily: fonts.secondary[400],
                color: colors.black,
                left: 10,
              }}>
              {new Intl.NumberFormat().format(beratTotal)} gr
            </Text>

          </View>
          <TouchableOpacity
            onPress={() => {

              // setLoading(true);

              getData('user').then(res => {

                const dd = {
                  fid_user: res.id,
                  nama_lengkap: res.nama_lengkap,
                  telepon: res.telepon,
                  harga_total: sub,
                  berat_total: beratTotal
                }

                console.log('pengguna', data);
                let textFormat = '*Pesanan Kemejakerenz*%0AHallo Kak Saya Mau Order%0A%0A';
                textFormat += `Nama Lengkap : ${res.nama_lengkap}%0A`
                textFormat += `Telepon       : ${res.telepon}%0A`
                textFormat += `----------------------------------%0A%0A`

                data.map((item, index) => {
                  textFormat += `${index + 1}) ${item.nama_barang} (kode : ${item.kode_barang})%0A${new Intl.NumberFormat().format(item.harga)} x ${item.qty} = Rp ${new Intl.NumberFormat().format(item.total)}%0A`;
                })

                textFormat += `----------------------------------%0A%0A`
                textFormat += `*Total : ${new Intl.NumberFormat().format(sub)}*`

                console.log(textFormat);

                Linking.openURL('https://wa.me/6281287893388?text=' + textFormat)

                setLoading(false);
                // setTimeout(() => {
                //   setLoading(false);
                //   navigation.navigate('Checkout', dd)
                // }, 1500)


                // console.log(dd);
                // axios.post(urlAPI + '/1add_transaksi.php', dd).then(rr => {
                //   console.log(rr.data);

                //   setTimeout(() => {
                //     setLoading(false);
                //     showMessage({
                //       type: 'success',
                //       message: 'Transaksi kamu berhasil dikirim'
                //     })
                //     navigation.replace('ListData')
                //   }, 1500)


                // })


              });



            }}
            style={{

              backgroundColor: colors.primary,
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row'
            }}>
            <Icon type='ionicon' name="open-outline" color={colors.white} size={windowWidth / 20} />
            <Text
              style={{
                fontSize: windowWidth / 20,
                left: 5,
                fontFamily: fonts.secondary[600],
                color: colors.white,

              }}>
              ORDER
            </Text>
          </TouchableOpacity>


        </View>}


      {loading && <View style={{
        padding: 10
      }}><ActivityIndicator size="large" color={colors.primary} /></View>}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
