import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { MyButton, MyGap } from '../../components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Modalize } from 'react-native-modalize';
import { showMessage } from 'react-native-flash-message';
import { getData, storeData, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default function Pinjam({ navigation, route }) {
  const item = route.params;
  navigation.setOptions({
    headerShown: false,
  });

  const isFocused = useIsFocused();

  const [jumlah, setJumlah] = useState(1);
  const [user, setUser] = useState({});
  const [suka, setSuka] = useState(0);

  useEffect(() => {
    if (isFocused) {
      // modalizeRef.current.open();
      __getTransaction();

    }
  }, [isFocused]);

  const [ukuran, setUkuran] = useState([]);
  const [cek, setCek] = useState({});

  const __getTransaction = () => {
    getData('user').then(res => {
      console.log('data user', res.id);

      axios.post(urlAPI + '/1_wish_cek.php', {
        fid_user: res.id,
        fid_barang: route.params.id
      }).then(cek => {

        console.log(cek.data);
        setSuka(cek.data);
      })

      setUser(res);
    });

    axios.post(urlAPI + '/1data_variant.php', {
      fid_barang: route.params.id
    }).then(cek => {

      console.log(cek.data);
      setUkuran(cek.data)
    })

  }

  const modalizeRef = useRef();

  const onOpen = () => {
    modalizeRef.current?.open();
  };




  const addToCart = () => {
    const kirim = {
      fid_user: user.id,
      fid_barang: item.id,
      harga_dasar: item.harga_dasar,
      diskon: item.diskon,
      ukuran: cek.ukuran,
      harga: item.harga_barang,
      qty: jumlah,
      total: item.harga_barang * jumlah
    };
    console.log('kirim tok server', kirim);
    axios
      .post(urlAPI + '/1add_cart.php', kirim)
      .then(res => {
        console.log(res);
        setJumlah(0);

        showMessage({
          type: 'success',
          message: 'Berhasil ditambahkan ke keranjang',
        });
        // navigation.replace('MainApp');
        modalizeRef.current.close();
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>



      <View
        style={{
          height: 50,
          // padding: 10,
          paddingRight: 10,
          backgroundColor: colors.primary,

          flexDirection: 'row',
        }}>
        <View style={{ justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon type="ionicon" name="arrow-back" color={colors.white} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
              color: colors.white,
            }}>
            {item.nama_barang}
          </Text>
        </View>
      </View>
      <ScrollView>
        <Image

          style={{
            height: windowHeight / 2,
            resizeMode: 'contain',
            width: windowWidth
          }}
          source={{
            uri: item.image,
          }}
        />
        <View
          style={{
            flex: 1,
            padding: 10,
          }}>


          <View
            style={{
              backgroundColor: colors.white,
              flex: 1,
            }}>
            <View
              style={{
                padding: 10,
              }}>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    fontSize: windowWidth / 20,
                    color: colors.secondary,
                  }}>
                  Rp. {new Intl.NumberFormat().format(item.harga_barang)}
                </Text>
                <TouchableOpacity
                  onPress={() => {

                    if (suka == 0) {

                      axios.post(urlAPI + '/1_wish_add.php', {
                        fid_user: user.id,
                        fid_barang: route.params.id
                      }).then(cek => {

                        console.log(cek.data);
                        __getTransaction();

                      })
                    } else {
                      axios.post(urlAPI + '/1_wish_hapus.php', {
                        fid_user: user.id,
                        fid_barang: route.params.id
                      }).then(x => {
                        getData('user').then(tkn => {
                          __getTransaction()
                        });

                      })
                    }
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon type="ionicon" name={suka > 0 ? 'heart' : 'heart-outline'} color={suka > 0 ? colors.danger : colors.black} />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 20,
                  color: colors.primary,
                }}>
                {item.nama_barang}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 25,
                  color: colors.primary,
                }}>
                {item.keterangan_barang}
              </Text>
            </View>


          </View>
        </View>
      </ScrollView>
      <MyButton
        Icons="cart-outline"
        fontWeight="bold"
        radius={0}
        title="Tambahkan ke keranjang"
        warna={colors.primary}
        onPress={onOpen}
      />


      <Modalize
        withHandle={false}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        // snapPoint={windowHeight / 1.5}
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
                  {item.nama_barang}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.secondary[600],
                    fontSize: 20,
                    color: colors.black,
                  }}>
                  Rp. {new Intl.NumberFormat().format(item.harga_barang * jumlah)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => modalizeRef.current.close()}>
                <Icon type="ionicon" name="close-outline" size={35} />
              </TouchableOpacity>
            </View>
          </View>
        }

        ref={modalizeRef}>

        {ukuran.length == 0 &&
          <View style={{
            flex: 1,
            padding: 20,
          }}>
            <Text style={{
              color: colors.border,
            }}>Ukuran produk belum di atur . . .</Text>
          </View>
        }

        {ukuran.length > 0 &&
          <View style={{ flex: 1, }}>
            <View style={{
              margin: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.border,
            }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 25,
                  color: colors.primary,
                }}>
                Pilih ukuran
              </Text>

              <FlatList data={ukuran} renderItem={({ item, index }) => {
                return (
                  <TouchableWithoutFeedback onPress={() => {
                    setCek(item)
                  }}>
                    <View style={{
                      padding: 10,
                      marginVertical: 2,
                      backgroundColor: cek.id_variant == item.id_variant ? colors.primary : colors.white,
                      borderBottomColor: colors.secondary,
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        flex: 1,
                        fontFamily: fonts.secondary[600],
                        fontSize: 20,
                        color: cek.id_variant == item.id_variant ? colors.white : colors.black,
                      }}>{item.ukuran}</Text>
                      <Text style={{
                        backgroundColor: cek.id_variant == item.id_variant ? colors.white : colors.black,
                        color: cek.id_variant == item.id_variant ? colors.black : colors.white,
                        paddingHorizontal: 10,
                        width: 100,
                        fontFamily: fonts.secondary[600],
                        fontSize: 15,
                        textAlign: 'center',
                      }}>Stok : {item.stok}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              }} />
            </View>

            <View style={{ padding: 10, flex: 1 }}>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ flex: 1 }}>
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
                    flexDirection: 'row',

                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      jumlah == 1
                        ? showMessage({
                          type: 'danger',
                          message: 'Minimal penjualan 1 kg',
                        })
                        : setJumlah(parseFloat(jumlah) - 1);
                    }}
                    style={{
                      backgroundColor: colors.primary,
                      width: '30%',
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
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>

                    <TextInput keyboardType='number-pad' onChangeText={x => {

                      setJumlah(x)

                    }} style={{ fontSize: 20, height: 40, fontFamily: fonts.secondary[600], textAlign: 'center' }} value={jumlah.toString()} />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      jumlah >= item.stok
                        ? showMessage({
                          type: 'danger',
                          message: 'Pembelian melebihi batas !',
                        })
                        : setJumlah(parseFloat(jumlah) + 1);
                    }}
                    style={{
                      backgroundColor: colors.primary,
                      width: '30%',
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


              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  onPress={addToCart}
                  style={{
                    backgroundColor: colors.secondary,
                    borderRadius: 10,
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
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

        }





      </Modalize>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({});
