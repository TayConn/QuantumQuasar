//
//  ContentView.swift
//  WeSplit
//
//  Created by Taylor Conn on 2/29/24.
//

import SwiftUI

struct ContentView: View {
    @State private  var tapCount = 0
    var body: some View {
        VStack {
            Button("Tap Count: \(tapCount)") {
                self.tapCount += 1
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
