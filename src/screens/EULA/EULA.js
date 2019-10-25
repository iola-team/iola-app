import React, { Component } from 'react';
import { Container, Text, View } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

import { withStyleSheet as styleSheet } from '~theme';

const bulletListData = [
  'Parties This Agreement is between you and iola only, and not Apple, Inc. (“Apple”). Notwithstanding the foregoing, you acknowledge that Apple and its subsidiaries are third party beneficiaries of this Agreement and Apple has the right to enforce this Agreement against you. iola, not Apple, is solely responsible for the iola app and its content.',
  'Privacy iola may collect and use information about your usage of the iola app, including certain types of information from and about your device. iola may use this information, as long as it is in a form that does not personally identify you, to measure the use and performance of the iola app.',
  'Limited License iola grants you a limited, non-exclusive, non-transferable, revocable license to use theiola app for your personal, non-commercial purposes. You may only use theiola app on Apple devices that you own or control and as permitted by the App Store Terms of Service.',
  `Age Restrictions By using the iola app, you represent and warrant that (a) you are 17 years of age or older and you agree to be bound by this Agreement; (b) if you are under 17 years of age, you have obtained verifiable consent from a parent or legal guardian; and (c) your use of the iola app does not violate any applicable law or regulation. Your access to the iola app may be terminated without warning if iola believes, in its sole discretion, that you are under the age of 17 years and have not obtained verifiable consent from a parent or legal guardian. If you are a parent or legal guardian and you provide your consent to your child's use of the iola app, you agree to be bound by this Agreement in respect to your child's use of the iola app.`,
  'Objectionable Content Policy Content may not be submitted to iola, who will moderate all content and ultimately decide whether or not to post a submission to the extent such content includes, is in conjunction with, or alongside any, Objectionable Content. Objectionable Content includes, but is not limited to: (i) sexually explicit materials; (ii) obscene, defamatory, libelous, slanderous, violent and/or unlawful content or profanity; (iii) content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary right, or that is deceptive or fraudulent; (iv) content that promotes the use or sale of illegal or regulated substances, tobacco products, ammunition and/or firearms; and (v) gambling, including without limitation, any online casino, sports books, bingo or poker.',
  'Warranty iola disclaims all warranties about the iola app to the fullest extent permitted by law. To the extent any warranty exists under law that cannot be disclaimed, iola, not Apple, shall be solely responsible for such warranty.',
  'Maintenance and Support iola does provide minimal maintenance or support for it but not to the extent that any maintenance or support is required by applicable law, iola, not Apple, shall be obligated to furnish any such maintenance or support.',
  'Product Claims iola, not Apple, is responsible for addressing any claims by you relating to the iola app or use of it, including, but not limited to: (i) any product liability claim; (ii) any claim that the iola app fails to conform to any applicable legal or regulatory requirement; and (iii) any claim arising under consumer protection or similar legislation. Nothing in this Agreement shall be deemed an admission that you may have such claims.',
  'Third Party Intellectual Property Claims iola shall not be obligated to indemnify or defend you with respect to any third party claim arising out or relating to the iola app. To the extent iola is required to provide indemnification by applicable law, iola, not Apple, shall be solely responsible for the investigation, defense, settlement and discharge of any claim that the iola app or your use of it infringes any third party intellectual property right.',
];

@styleSheet('iola.EULAScreen', {
  content: {
    padding: 15,
  },

  title: {
    fontWeight: '600',
    marginBottom: 20,
  },

  text: {
    fontSize: 16,
    lineHeight: 22,
  },

  list: {
    marginTop: 10,
    marginBottom: 100,
  },

  listElement: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  listText: {
    flex: 1,
    paddingLeft: 10,
  }
})
export default class EULAScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: () => <Text>End User License Agreement</Text>,
    headerTransparent: false,
  });

  render() {
    const { styleSheet: styles } = this.props;

    return (
      <Container>
        <ScrollView style={styles.content}>
          <View>
            <Text style={[styles.title, styles.text]}>This End User License Agreement (“Agreement”) is between you and iola and governs use of this app made available through the Apple App Store and Google Play Market. By installing the iola app, you agree to be bound by this Agreement and understand that there is no tolerance for objectionable content. If you do not agree with the terms and conditions of this Agreement, you are not entitled to use the iola app.</Text>
            <Text style={styles.text}>In order to ensure iola provides the best experience possible for everyone, we strongly enforce a no tolerance policy for objectionable content. If you see inappropriate content, please use the “Report as offensive” feature found under each post.</Text>
            <View style={styles.list}>
              {bulletListData.map((row, index) => (
                <View style={styles.listElement} key={index}>
                  <Text>{'\u2022'}</Text>
                  <Text style={[styles.listText, styles.text]}>{row}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Container>
    );
  }
}