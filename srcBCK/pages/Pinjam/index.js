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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function Pinjam({ navigation, route }) {
  const item = route.params;
  navigation.setOptions({
    headerShown: false,
  });

  const isFocused = useIsFocused();

  const [jumlah, setJumlah] = useState(1);
  const [user, setUser] = useState({});
  const [cart, setCart] = useState(0);
  const [stk, setSTK] = useState(0);
  const [ukuran, setUkuran] = useState('');
  const [cek, setCek] = useState('')

  useEffect(() => {
    if (isFocused) {
      // modalizeRef.current.open();
      getDataBarang();
      getData('user').then(res => {
        setUser(res);
      });
      getData('cart').then(res => {
        setCart(res);
      });
    }
  }, [isFocused]);


  const getDataBarang = () => {
    axios.post(urlAPI + '/1data_variant.php', {
      fid_barang: route.params.id,
    }).then(res => {

      setVariant(res.data);
      console.warn(res.data);

    });
  };

  const modalizeRef = useRef();

  const [variant, setVariant] = useState([])

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const addToCart = () => {
    const kirim = {
      fid_user: user.id,
      fid_barang: item.id,
      harga_dasar: item.harga_dasar,
      diskon: item.diskon,
      ukuran: ukuran,
      harga: item.harga_barang,
      qty: jumlah,
      total: item.harga_barang * jumlah
    };
    console.log('kirim tok server', kirim);
    axios
      .post(urlAPI + '/1add_cart.php', kirim)
      .then(res => {
        console.log(res);

        showMessage({
          type: 'success',
          message: 'Berhasil ditambahkan ke keranjang',
        });
        navigation.goBack();
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
      <View
        style={{
          flex: 1,
        }}>
        <Image style={{ height: windowHeight / 2, width: '100%' }}
          source={{ uri: item.image, }} />

        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
          }}>
          <View
            style={{
              padding: 10,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.secondary,
              }}>
              Rp. {new Intl.NumberFormat().format(item.harga_barang)}
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: windowWidth / 20,
                color: colors.primary,
              }}>{item.nama_barang}</Text>
            <Text
              style={{
                fontFamily: fonts.secondary[400],
                fontSize: windowWidth / 28,
                color: colors.black,
              }}>{item.keterangan_barang}
            </Text>
          </View>
        </View>
      </View>

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
        snapPoint={windowHeight / 2}
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
        <View style={{ flex: 1, }}>
          <View style={{ padding: 10, flex: 1 }}>

            {variant.length == 0 &&


              <Text style={{ fontFamily: fonts.secondary[600], color: colors.border, marginBottom: 10, }}>Ukuran untuk produk ini belum ada</Text>
            }
            {variant.length > 0 &&

              <>
                <Text style={{ fontFamily: fonts.secondary[600], color: colors.black, marginBottom: 10, }}>Silahkan Pilih Ukuran</Text>


                <FlatList showsVerticalScrollIndicator data={variant} numColumns={4} renderItem={({ item, index }) => {
                  return (
                    <TouchableWithoutFeedback onPress={() => {
                      console.log(item.id_variant);
                      setCek(item.id_variant);
                      setSTK(item.stok)
                      setUkuran(item.ukuran)
                    }}>
                      <View style={{
                        padding: 10, borderWidth: 1,
                        borderRadius: 5,
                        borderColor: cek.length > 0 && cek == item.id_variant ? colors.black : colors.zavalabs,
                        backgroundColor: cek.length > 0 && cek == item.id_variant ? colors.black : colors.zavalabs,
                        width: windowWidth / 4.7,
                        marginHorizontal: 5,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Text style={{ fontFamily: fonts.secondary[600], color: cek.length > 0 && cek == item.id_variant ? colors.white : '#AAB4C8', }}>{item.ukuran}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )
                }} />
              </>

            }

            <View style={{
              flexDirection: 'row',
              marginTop: 10,
            }}>
              <Text style={{ fontFamily: fonts.secondary[600], color: colors.black, marginRight: 10 }}>Stok</Text>
              <Text style={{ fontFamily: fonts.secondary[800], color: colors.danger, fontSize: 25 }}>{stk}</Text>
            </View>


            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.secondary[600], color: colors.black, }}>
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
                      : setJumlah(jumlah - 1);
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
                  <Text
                    style={{ fontSize: 16, fontFamily: fonts.secondary[600] }}>
                    {jumlah}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    jumlah >= item.stok
                      ? showMessage({
                        type: 'danger',
                        message: 'Pembelian melebihi batas !',
                      })
                      : setJumlah(jumlah + 1);
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


            {stk > 0 &&
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
            }
          </View>
        </View>
      </Modalize>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
